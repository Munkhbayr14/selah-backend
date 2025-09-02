import { glob } from 'glob';

export const getResourcePath = (fileName: string): Promise<string> => {

  const resourceFolder = process.env.RESOURCE_FOLDER_LOCATION;

  const fileSearchVal = resourceFolder + '/**/' + fileName.split('/').pop();

  return new Promise(async (resolve, reject) => {

    const files = await glob(fileSearchVal);

    console.log('file utga:', files);

    if (files[0] === undefined || files.length < 1) {
      reject(fileName);
    }

    resolve(files[0]);
  });
};
