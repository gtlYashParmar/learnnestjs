import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './schemas/user.schema';
import { AuthDto, VerifyOtpDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async authenticateUser(authDto: AuthDto): Promise<{ isNewUser: boolean; otp: string }> {
    const user = await this.userModel.findOne({ mobileNumber: authDto.mobileNumber });
    const otp = this.generateOtp();
    
    if (user) {
      user.otp = otp;
      user.otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
      await user.save();
      return { isNewUser: false, otp };
    } else {
      return { isNewUser: true, otp };
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ token: string }> {
    const user = await this.userModel.findOne({ 
      mobileNumber: verifyOtpDto.mobileNumber,
      otp: verifyOtpDto.otp,
      otpExpiration: { $gt: new Date() }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid OTP');
    }

    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    return { token: this.generateToken(user) };
  }

  async registerUser(registerDto: RegisterDto): Promise<{ token: string }> {
    const existingUser = await this.userModel.findOne({ mobileNumber: registerDto.mobileNumber });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const adminMobile = this.configService.get<string>('ADMIN_MOBILE');
    const role = registerDto.mobileNumber === adminMobile ? 'admin' : 'user';

    const newUser = new this.userModel({
      ...registerDto,
      role,
    });

    await newUser.save();

    return { token: this.generateToken(newUser) };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateToken(user: UserDocument): string {
    const payload = { sub: user.id, mobileNumber: user.mobileNumber, role: user.role };
    return this.jwtService.sign(payload);
  }
}