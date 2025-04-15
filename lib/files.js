import { FilesCollection } from 'meteor/ostrio:files';
import { Meteor } from 'meteor/meteor';
import path from 'path-browserify';

// Images = new FS.Collection("images", {
//     stores: [new FS.Store.FileSystem("images")]
// });

// Images = new FilesCollection({
//   collectionName: 'Images',
//   allowClientCode: false, // Disallow remove files from Client
//   onBeforeUpload: function (file) {
//     // Allow upload files under 10MB, and only in png/jpg/jpeg formats
//     if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
//       return true;
//     } else {
//       return 'Please upload image, with size equal or less than 10MB';
//     }
//   }
// });
// newImages = new FS.Collection("newImages", {
//     stores: [new FS.Store.GridFS("newImages", {
//         //mongoUrl: 'mongodb://127.0.0.1:27017/meteor/',
//         maxTries: 1, // optional, default 5
//         chunkSize: 1024 * 1024
//     })]
// });

export const PostImages = new FilesCollection({
  collectionName: 'postImages',
  storagePath: () => {
    if (Meteor.isServer) {
      return path.join(process.env.PWD, 'uploads', 'postImages');
    }
  },
  allowClientCode: false,
  onBeforeUpload(file) {
    return file.size <= 10485760; // 10MB limit
  },
  interceptDownload(http, fileRef, version) {
    if (Meteor.userId()) {
      return false; // Autoriser le téléchargement
    } else {
      http.response.writeHead(403);
      http.response.end('Forbidden');
      return true;
    }
  }
});

export const Suits = new FilesCollection({
  collectionName: 'suits',
  storagePath: () => {
    if (Meteor.isServer) {
      return path.join(process.env.PWD, 'uploads', 'suits');
    }
  },
  allowClientCode: false,
  onBeforeUpload(file) {
    return file.size <= 10485760; // 10MB limit
  },
  interceptDownload(http, fileRef, version) {
    if (Meteor.userId()) {
      return false; // Autoriser le téléchargement
    } else {
      http.response.writeHead(403);
      http.response.end('Forbidden');
      return true;
    }
  }
});

if (Meteor.isServer) {

    // Images.allow({
    //     'insert': function () {
    //         // add custom authentication code here
    //         return true;
    //     },
    //     'update': function () {
    //         // add custom authentication code here
    //         return true;
    //     },
    //     'download': function (userId, fileObj) {
    //         return true
    //     }
    // });

    // newImages.allow({
    //     'insert': function () {
    //         // add custom authentication code here
    //         return true;
    //     },
    //     'update': function () {
    //         // add custom authentication code here
    //         return true;
    //     },
    //     'download': function (userId, fileObj) {
    //         return true
    //     }
    // });

    PostImages.allow({
        'insert': function() {
            return true;
        },
        'update': function() {
            return true;
        },
        'remove': function() {
            return true;
        }
    });

    Suits.allow({
        'insert': function() {
            return true;
        },
        'update': function() {
            return true;
        },
        'remove': function() {
            return true;
        }
    });

    PostImages.denyClient();
    Meteor.publish("postImages", function() {
        return PostImages.find({}).cursor;
    });

    Suits.denyClient();
    Meteor.publish("suits", function() {
        return Suits.find({}).cursor;
    });
}