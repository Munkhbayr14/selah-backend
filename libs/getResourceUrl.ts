import { getResourcePath } from './getResourcePath';

const getResourceUrl = async (filename: string): Promise<string> => {
    try {
        if (/^https?:\/\//i.test(filename)) {
            return filename;
        }

        const fileFullPath = await getResourcePath(filename);
        const resourceDomain = process.env.RESOURCE_DOMAIN;
        const folderLocation = process.env.RESOURCE_FOLDER_LOCATION;

        if (!resourceDomain || !folderLocation) {
            throw new Error('RESOURCE_DOMAIN or RESOURCE_FOLDER_LOCATION is not set');
        }
        const normalizedPath = fileFullPath.replace(/^C:[\\/]/, '').replace(/\\/g, '/');
        const fileRelativePath = normalizedPath.replace(folderLocation.replace(/^C:[\\/]/, '').replace(/\\/g, '/'), '');
        console.log("eeeee" + normalizedPath)
        console.log(fileRelativePath.split('/').at(-1))
        return fileRelativePath.split('/').at(-1);

    } catch (error) {
        console.error('COULD NOT FIND FILE ERROR: ', error);
        return filename;
    }
};

export default getResourceUrl;
