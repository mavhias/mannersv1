import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Posts } from '../api/posts';
import SimpleSchema from 'simpl-schema';

// Schéma de validation pour les posts
const postSchema = new SimpleSchema({
  title: {
    type: String,
    min: 1,
    max: 100
  },
  content: {
    type: String,
    min: 1
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  userId: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return this.userId;
      }
    }
  }
});

Meteor.methods({
  'posts.insert'(post) {
    // Vérification de l'authentification
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Vous devez être connecté pour créer un post');
    }

    // Validation du schéma
    postSchema.validate(post);

    // Insertion du post
    return Posts.insert({
      ...post,
      createdAt: new Date(),
      userId: this.userId
    });
  },

  'posts.update'(postId, post) {
    // Vérification de l'authentification
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Vous devez être connecté pour modifier un post');
    }

    // Vérification de la propriété du post
    const existingPost = Posts.findOne(postId);
    if (!existingPost) {
      throw new Meteor.Error('not-found', 'Post non trouvé');
    }
    if (existingPost.userId !== this.userId) {
      throw new Meteor.Error('not-authorized', 'Vous ne pouvez modifier que vos propres posts');
    }

    // Validation du schéma
    postSchema.validate(post);

    // Mise à jour du post
    return Posts.update(postId, {
      $set: {
        ...post,
        updatedAt: new Date()
      }
    });
  },

  'posts.remove'(postId) {
    // Vérification de l'authentification
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Vous devez être connecté pour supprimer un post');
    }

    // Vérification de la propriété du post
    const post = Posts.findOne(postId);
    if (!post) {
      throw new Meteor.Error('not-found', 'Post non trouvé');
    }
    if (post.userId !== this.userId) {
      throw new Meteor.Error('not-authorized', 'Vous ne pouvez supprimer que vos propres posts');
    }

    // Suppression du post
    return Posts.remove(postId);
  }
}); 