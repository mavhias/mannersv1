import { FilesCollection } from 'meteor/ostrio:files';
import path from 'path';

const basePath = path.join(process.env.PWD, 'uploads');
console.log('Base storage path:', basePath);

const validateFile = (file) => {
  console.log('Validating file:', {
    name: file.name,
    size: file.size,
    type: file.type,
    extension: file.extension
  });

  if (!file || typeof file !== 'object') {
    console.error('Invalid file object');
    return false;
  }

  if (!file.size || typeof file.size !== 'number') {
    console.error('Invalid file size');
    return false;
  }

  if (!file.extension || typeof file.extension !== 'string') {
    console.error('Invalid file extension');
    return false;
  }

  return true;
};

export const Images = new FilesCollection({
  collectionName: 'Images',
  storagePath: path.join(basePath, 'images'),
  allowClientCode: false,
  onBeforeUpload(file) {
    console.log('File object:', file);
    
    // Validation basique
    if (!file || typeof file !== 'object') {
      return 'Invalid file object';
    }

    // Validation de la taille
    if (!file.size || typeof file.size !== 'number' || file.size > 10485760) {
      return 'File size must be less than 10MB';
    }

    // Validation du type de fichier
    if (!file.extension || !/png|jpg|jpeg/i.test(file.extension)) {
      return 'Only PNG, JPG, or JPEG files are allowed';
    }

    return true;
  }
});

export const Cvs = new FilesCollection({
  collectionName: 'Cvs',
  storagePath: path.join(basePath, 'cvs'),
  allowClientCode: false,
  onBeforeUpload(file) {
    if (!validateFile(file)) {
      return 'Invalid file format';
    }

    if (file.size > 10485760) {
      return 'File size exceeds 10MB limit';
    }

    if (!/pdf|doc|docx/i.test(file.extension)) {
      return 'Invalid file type. Only PDF, DOC, or DOCX are allowed';
    }

    return true;
  }
});

export const Cni = new FilesCollection({
  collectionName: 'Cni',
  storagePath: path.join(basePath, 'cni'),
  allowClientCode: false,
  onBeforeUpload(file) {
    if (!validateFile(file)) {
      return 'Invalid file format';
    }

    if (file.size > 10485760) {
      return 'File size exceeds 10MB limit';
    }

    if (!/pdf|jpg|jpeg/i.test(file.extension)) {
      return 'Invalid file type. Only PDF, JPG, or JPEG are allowed';
    }

    return true;
  }
});

export const Png = new FilesCollection({
  collectionName: 'Png',
  storagePath: path.join(basePath, 'png'),
  allowClientCode: false,
  onBeforeUpload(file) {
    if (!validateFile(file)) {
      return 'Invalid file format';
    }

    if (file.size > 10485760) {
      return 'File size exceeds 10MB limit';
    }

    if (!/png|jpg|jpeg/i.test(file.extension)) {
      return 'Invalid file type. Only PNG, JPG, or JPEG are allowed';
    }

    return true;
  }
});

if (Meteor.isServer) {
  Images.denyClient();
  Meteor.publish('files.images.all', async function () {
    return Images.find({}).cursor;
  });

  Cvs.denyClient();
  Meteor.publish('files.cvs.all', async function () {
    return Cvs.find({}).cursor;
  });

  Cni.denyClient();
  Meteor.publish('files.cni.all', async function () {
    return Cni.find({}).cursor;
  });

  Png.denyClient();
  Meteor.publish('files.png.all', async function () {
    return Png.find({}).cursor;
  });
}