import { Op, Sequelize } from 'sequelize';
import { ListFilterDto } from '../dto/feedPostFilter.dto';
import { PostStatus, SortOrder } from 'src/common/enums';
import { District } from 'src/module/location/entities/district.entity';

/**
 * Utility to build Sequelize query for fetching post feeds with optional filters
 */
export class PostQueryBuilder {
  static buildFeedQuery(filters: ListFilterDto): any {
    const { keyword, offset, districtIds, sort, subCategoryIds, type } = filters;

    // Base condition: only approved posts
    const where: any = {
      status: PostStatus.APPROVED,
    };

    // Optional filters
    if (type) where.type = type;
    if (subCategoryIds?.length) where.subCategoryId = { [Op.in]: subCategoryIds };
    if (keyword)
      where[Op.or] = [{ title: { [Op.like]: `%${keyword}%` } }, { description: { [Op.like]: `%${keyword}%` } }];

    // Include districts if filtered
    const include = districtIds?.length
      ? [
          {
            model: District,
            as: 'districts',
            attributes: ['districtName'],
            through: { attributes: [] },
            where: { id: { [Op.in]: districtIds } },
            required: true,
          },
        ]
      : [];

    // Return full query object
    return {
      where,
      include,
      attributes: [
        'id',
        'title',
        'type',
        'mainImage',
        'createdAt',
        'rewardAmount',
        [
          Sequelize.literal(`(
      SELECT d.districtName
      FROM PostDistricts pd
      JOIN Districts d ON d.id = pd.districtId
      WHERE pd.postId = Post.id
      LIMIT 1
    )`),
          'districtName',
        ],
      ],
      order: [['createdAt', sort === SortOrder.OLDEST ? 'ASC' : 'DESC']],
      limit: 40,
      offset,
    };
  }
}
