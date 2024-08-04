import { TokenUserDto } from '@Api/dto/response/token-user.dto';
import { GetTokenCommand } from '@Application/commands/auth/get-token.command';
import { UserModel } from '@Domain/models/user.model';
import {
  IAuthService,
  IAuthServiceSymbol,
} from '@Domain/services/auth/auth.service';
import {
  IUserService,
  IUserServiceSymbol,
} from '@Domain/services/user/user.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyUserCredentials } from '@Shared/utils/auth.util';

@Injectable()
export class GetTokenUseCase {
  constructor(
    @Inject(IAuthServiceSymbol)
    private readonly authService: IAuthService,
    @Inject(IUserServiceSymbol)
    private readonly userService: IUserService,
  ) {}

  async execute({ identify }: GetTokenCommand): Promise<TokenUserDto> {
    let user: UserModel;

    if (identify.cpf) {
      user = await this.getUserByCpf(identify.cpf);
    }

    if (identify.email) {
      user = await this.getUserByEmail(identify.email);
      await verifyUserCredentials(identify.password, user.password);
    }

    const accessToken = await this.authService.generateToken(user.id);
    return { userId: user.id, accessToken };
  }

  private async getUserByCpf(cpf: string): Promise<UserModel> {
    const user: UserModel = await this.userService.getOne({ cpf });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private async getUserByEmail(email: string): Promise<UserModel> {
    const user: UserModel = await this.userService.getOne({ email });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
