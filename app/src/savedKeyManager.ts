import fs from 'fs';

const KeyFile = (key: string | null = null) => `{"key": ${key != null ? '"' + key + '"' : key}}`;

function getUserHome() {
  return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}

export const getKey = (): string | null => {
  let key = null;
  try {
    const settingFile = fs.readFileSync(`${getUserHome()}\\sklp_setting.json`);
    key = JSON.parse(settingFile.toString()).key;
  } catch (error) {
    fs.writeFile(`${getUserHome()}\\sklp_setting.json`, KeyFile(), { encoding: 'utf-8' }, () => {});
  }
  return key;
};

export const setKey = (value: string) => {
  try {
    fs.writeFile(`${getUserHome()}\\sklp_setting.json`, KeyFile(value), { encoding: 'utf-8' }, () => {});
  } catch (error) {}
};
