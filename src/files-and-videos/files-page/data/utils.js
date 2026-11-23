import {
  InsertDriveFile,
  Terminal,
  AudioFile,
} from '@openedx/paragon/icons';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import FILES_AND_UPLOAD_TYPE_FILTERS from '../../generic/constants';

ensureConfig([
  'STUDIO_BASE_URL',
], 'Course Apps API service');

// First three letters of the Ukrainian month names the CMS writes ("Січ.", "Лист.", "Травень", ...).
const UK_MONTH_PREFIXES = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'];
const UK_SERVER_DATE = /^(\d{1,2})\s+([^\d\s.]+)\.?\s+(\d{4})\s+(?:р\.\s+)?(?:о\s+)?(\d{1,2}):(\d{2})/;

/**
 * Reads the date the CMS sends for an asset.
 *
 * The CMS writes it in the language of the request ("Nov 19, 2026 at 14:05 UTC" in
 * English, "19 Лист. 2026 14:05 UTC" in Ukrainian), and `new Date()` only understands
 * the first. Returns null when neither form fits.
 */
export const parseServerDate = (value) => {
  if (!value) {
    return null;
  }
  const native = new Date(value.replace(/\bat\b/g, ''));
  if (!Number.isNaN(native.getTime())) {
    return native;
  }
  const match = UK_SERVER_DATE.exec(value.trim());
  const month = match ? UK_MONTH_PREFIXES.indexOf(match[2].toLowerCase().slice(0, 3)) : -1;
  if (month < 0) {
    return null;
  }
  return new Date(Date.UTC(Number(match[3]), month, Number(match[1]), Number(match[4]), Number(match[5])));
};

export const updateFileValues = (files) => {
  const updatedFiles = [];
  files.forEach(file => {
    let wrapperType = 'other';
    if (FILES_AND_UPLOAD_TYPE_FILTERS.images.includes(file.contentType)) {
      wrapperType = 'image';
    } else if (FILES_AND_UPLOAD_TYPE_FILTERS.documents.includes(file.contentType)) {
      wrapperType = 'document';
    } else if (FILES_AND_UPLOAD_TYPE_FILTERS.code.includes(file.contentType)) {
      wrapperType = 'code';
    } else if (FILES_AND_UPLOAD_TYPE_FILTERS.audio.includes(file.contentType)) {
      wrapperType = 'audio';
    }

    const { dateAdded, locked, usageLocations } = file;
    const parsedDate = parseServerDate(dateAdded);
    // A date the browser cannot read stays as the server wrote it, instead of "Invalid Date".
    const utcDateTime = parsedDate ? parsedDate.toString() : dateAdded;
    const lockStatus = locked ? 'locked' : 'public';
    const activeStatus = usageLocations?.length > 0 ? 'active' : 'inactive';

    updatedFiles.push({
      ...file,
      wrapperType,
      lockStatus,
      activeStatus,
      dateAdded: utcDateTime,
    });
  });

  return updatedFiles;
};

export const getSrc = ({ thumbnail, wrapperType, externalUrl }) => {
  if (thumbnail) {
    return externalUrl || `${getConfig().STUDIO_BASE_URL}${thumbnail}`;
  }
  switch (wrapperType) {
    case 'document':
      return InsertDriveFile;
    case 'code':
      return Terminal;
    case 'audio':
      return AudioFile;
    default:
      return InsertDriveFile;
  }
};

export const getUploadConflicts = (filesToUpload, assets) => {
  const filesFound = assets.map(item => item.displayName);
  const conflicts = {};
  const newFiles = [];
  filesToUpload.forEach(file => {
    if (filesFound.includes(file.name)) {
      conflicts[file.name] = file;
    } else {
      newFiles.push(file);
    }
  });
  return [conflicts, newFiles];
};
