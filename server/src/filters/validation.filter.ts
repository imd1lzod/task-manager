import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch()
export class ErrorHandler implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        // Xato holatini aniqlash
        const status = exception instanceof HttpException ? exception.getStatus() : 500;

        const responseBody =
            exception instanceof HttpException
                ? exception.getResponse()
                : { message: 'Internal server error' };

        const message =
            typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody
                ? (responseBody as any).message
                : responseBody;

        console.error({
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            status: status,
            message: message,
            stack: exception.stack, 
            exception: exception, 
        });

        response.status(status).json({
            success: false,
            statusCode: status,
            message: message,
        });
    }
}