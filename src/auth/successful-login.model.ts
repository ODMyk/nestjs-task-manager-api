import { ApiProperty } from "@nestjs/swagger";

export class SuccessfulLogin {
  @ApiProperty({
    description:
      'Access token for authorized user, that expires in 3600 seconds',
  })
  public accessToken: string;
}
