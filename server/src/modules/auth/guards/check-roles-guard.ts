import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/modules/user/enums/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log("salom");

        const roles = this.reflector.getAllAndOverride<Role[]>('isrole', [context.getClass(), context.getHandler()])

        const ctx = context.switchToHttp()
        const request = ctx.getRequest<
            Request & { role?: Role; id?: number }
        >()

        let userRole = request.role;
        console.log(userRole);
        console.log(roles);



        if (!userRole || !roles || !roles.includes(userRole)) {
            throw new ForbiddenException('Siz bu amalni bajara olmaysiz');
        }

        return true
    }
}