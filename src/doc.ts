import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as packageConfig from '../package.json';

export const generateDocument = (app) => {
    const option = new DocumentBuilder()
        .setTitle(packageConfig.name)
        .setDescription(packageConfig.description)
        .setVersion(packageConfig.version)
        .build()
    const doucument = SwaggerModule.createDocument(app, option)
    
    SwaggerModule.setup('/api/doc', app, doucument)
}
