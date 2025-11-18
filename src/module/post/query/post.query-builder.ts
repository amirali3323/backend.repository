import { Op } from 'sequelize';
import { ListFilterDto } from '../dto/feedPostFilter.dto';
import { PostStatus, SortOrder } from 'src/common/enums';
import { District } from 'src/module/location/entities/district.entity';

export class PostQueryBuilder {
  static buildFeedQuery(filters: ListFilterDto): any {
    const { keyword, offset, districtIds, sort, subCategoryIds, type } = filters;
    const where: any = {
      status: PostStatus.APPROVED,
    };

    if (type) where.type = type;
    if (subCategoryIds?.length) where.subCategoryId = { [Op.in]: subCategoryIds };
    if (keyword) where[Op.or] = [{ title: { [Op.like]: `%${keyword}%` } }, { description: { [Op.like]: `%${keyword}%` } }];

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

    return {
      where,
      include,
      order: [['createdAt', sort === SortOrder.OLDEST ? 'ASC' : 'DESC']],
      limit: 40,
      offset,
    };
  }
}
