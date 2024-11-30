import { Injectable } from '@nestjs/common';
import * as Forge from 'node-forge';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DecryptCredentialService {
  private cipher: string;
  private randomKey: string;
  private credentialsUser: string;
  private privateKey: string;

  constructor(private configService: ConfigService) {}

  public main(credentials: string) {
    this.cipher = credentials;
    this.splitStringCipher();
    this.decodeBase64RandomKey();
    this.readPrivateKey();
    this.decryptRandomKey();
    this.decryptCredentialsUser();

    return this.credentialsUser;
  }

  private splitStringCipher() {
    const cipherSplit = this.cipher.split('.');
    this.randomKey = cipherSplit[0];
    this.credentialsUser = cipherSplit[1];
  }

  private decodeBase64RandomKey() {
    this.randomKey = Forge.util.decode64(this.randomKey);
  }

  private readPrivateKey() {
    const path = this.configService.get<string>('PATH_PRIVATE_KEY');
    this.privateKey = fs.readFileSync(path, 'utf-8');
  }

  private decryptRandomKey() {
    const pem: string = this.privateKey;
    const passphrase: string = this.configService.get<string>(
      'PASSWORD_PRIVATE_KEY',
    );
    const keydecrypt = Forge.pki.decryptRsaPrivateKey(pem, passphrase);
    this.randomKey = keydecrypt.decrypt(this.randomKey, 'RSA-OAEP');
  }

  private decryptCredentialsUser() {
    const decipher = Forge.cipher.createDecipher('AES-ECB', this.randomKey);
    decipher.start();
    decipher.update(
      Forge.util.createBuffer(Forge.util.decode64(this.credentialsUser)),
    );
    decipher.finish();
    this.credentialsUser = JSON.parse(decipher.output.toString());
  }

  get splitCipher() {
    return this.splitStringCipher();
  }
}
