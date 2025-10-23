import { ContentModule } from '../content/content.module';
import { ModuleBuilder } from '../core/decorators';
import { DatabaseModule } from '../database/database.module';
import { addEntities } from '../database/helpers';
// import { ElasticModule } from '../elastic/elastic.module';
import { RbacModule } from '../rbac/rbac.module';
import { UserModule } from '../user/user.module';

import { MangaCommentController } from './controllers/manga-comment.controller';
import * as DtoMaps from './dtos';
import * as EntityMaps from './entities';
import { MangaRbac } from './rbac';
import * as RepositoryMaps from './repositories';
import * as ServiceMaps from './services';
import { MangaRecommendService } from './services/manga-recommend.service';

const entities = Object.values(EntityMaps);
const repositories = Object.values(RepositoryMaps);
const services = Object.values(ServiceMaps);
const dtos = Object.values(DtoMaps);

@ModuleBuilder(async (configure) => {
    return {
        imports: [
            UserModule,
            RbacModule,
            // ElasticModule, // 临时注释掉，避免 Elasticsearch 连接错误
            ContentModule,
            await addEntities(configure, entities),
            DatabaseModule.forRepository(repositories),
        ],
        controllers: [MangaCommentController],
        providers: [...dtos, ...services, MangaRecommendService, MangaRbac],
        exports: [DatabaseModule.forRepository(repositories), ...services, MangaRecommendService],
    };
})
export class MangaModule {}
