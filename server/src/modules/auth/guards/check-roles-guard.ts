import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/modules/user/enums/role.enum';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('isrole', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request & { role?: Role }>();
        const userRole = request.role?.toLocaleUpperCase() as Role;
        // console.log(userRole    );
        // console.log(requiredRoles);



        if (!userRole || !requiredRoles.includes(userRole)) {
            
            throw new ForbiddenException('Sizda bu amalni bajarishga ruxsat yo`q!');
        }

        return true;
    }
}
