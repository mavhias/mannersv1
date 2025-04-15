this.Images = new Meteor.Files({
  debug: true,
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 20MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024 * 1024 * 20 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 20MB';
    }
  }
});

if (Meteor.isServer) {
  Images.denyClient();
  Meteor.publish('files.images.all', async function () {
    return Images.find({}).cursor;
  });

} else {

  // Meteor.subscribe('files.images.all');
}

this.Cvs = new Meteor.Files({
  debug: true,
  collectionName: 'Cvs',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 20MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024 * 1024 * 20 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 20MB';
    }
  }
});
this.Cni = new Meteor.Files({
  debug: true,
  collectionName: 'Cni',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 20MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024 * 1024 * 20 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 20MB';
    }
  }
});

this.Png = new Meteor.Files({
  debug: true,
  collectionName: 'Png',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 20MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024 * 1024 * 20 && /png|jpg|pdf|docx|eml|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 20MB';
    }
  }
});

if (Meteor.isServer) {
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
} else {

  // Meteor.subscribe('files.images.all');
}