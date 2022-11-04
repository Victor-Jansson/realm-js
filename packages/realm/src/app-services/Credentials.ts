////////////////////////////////////////////////////////////////////////////
//
// Copyright 2022 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import { assert, binding } from "../internal";
import { App } from "./App";

/**
 * Types of an authentication provider.
 */
export enum ProviderType {
  AnonUser = "anon-user",
  ApiKey = "api-key",
  LocalUserPass = "local-userpass",
  CustomFunction = "custom-function",
  CustomToken = "custom-token",
  OAuth2Google = "oauth2-google",
  OAuth2Facebook = "oauth2-facebook",
  OAuth2Apple = "oauth2-apple",
}

export function isProviderType(arg: string): arg is ProviderType {
  return Object.values(ProviderType).includes(arg as ProviderType);
}

export class Credentials {
  /** @internal */
  public internal: binding.AppCredentials;

  /** @internal */
  private constructor(internal: binding.AppCredentials) {
    this.internal = internal;
  }

  /**
   * Creates credentials for an anonymous user. These can only be used once - using them a second
   * time will result in a different user being logged in. If you need to get a user that has already logged
   * in with the Anonymous credentials, use {@linkcode App.currentUser} or {@linkcode App.allUsers}.
   * @param reuse Reuse any existing anonymous user already logged in.
   * @return {Credentials} An instance of `Credentials` that can be used in {@linkcode App.logIn}.
   */
  static anonymous(reuse = true): Credentials {
    return new Credentials(binding.AppCredentials.anonymous(reuse));
  }

  /**
   * Creates credentials based on a login with an email address and a password.
   * @param credentials An object with username and password for the user.
   * @return {Credentials} An instance of `Credentials` that can be used in {@linkcode App.logIn}.
   */
  static emailPassword(credentials: { email: string; password: string }): Credentials {
    assert.string(credentials.email, "email");
    assert.string(credentials.password, "password");
    return new Credentials(binding.AppCredentials.usernamePassword(credentials.email, credentials.password));
  }

  /**
   * Creates credentials from an API key.
   * @param key A string identifying the API key.
   * @return {Credentials} An instance of `Credentials` that can be used in {@linkcode Realm.App.logIn}.
   */
  static apiKey(key: string): Credentials {
    return new Credentials(binding.AppCredentials.userApiKey(key));
  }
}
