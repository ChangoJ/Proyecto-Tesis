import bcrypt from 'bcrypt';

export function encriptarContrasena(contrasena: string): string {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(contrasena, salt);
    return hash;
}