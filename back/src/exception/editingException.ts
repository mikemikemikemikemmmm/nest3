import { HttpException, HttpStatus } from "@nestjs/common";
export class EditingException extends HttpException {
    constructor(editingUser: string, targetEntity: string, targetId: Number) {
        super(
            `${editingUser} is editing this resource(${targetEntity}, id ${targetId}).`,
            HttpStatus.CONFLICT
        );
    }
}
