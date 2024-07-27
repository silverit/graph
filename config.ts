import { assign, get, castArray, has } from "lodash";
const oneOf = (data: any, options: any, def?: any) => {
  const arrOpts = castArray(options);
  for (const opt of arrOpts) {
    if (has(data, opt)) {
      return get(data, opt);
    }
  }
  return def;
};
const _localConfig = {};
const configProvider = {
  get: (path: string) => {
    const config = process.env;
    return (
      get(_localConfig, path) || oneOf(config, [path, `EXPO_PUBLIC_${path}`])
    );
  },
  set: (config: { [key: string]: string }) => {
    assign(_localConfig, config);
  },
};
export default configProvider;
