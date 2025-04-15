import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

// Configuration de SimpleSchema
SimpleSchema.defineValidationErrorTransform((error) => error);
SimpleSchema.extendOptions(['autoform']);

export const Posts = new Mongo.Collection('posts');

export const PostSchema = new SimpleSchema({
    title: {
        type: String,
        label: 'Titre',
        min: 1,
        max: 200
    },
    content: {
        type: String,
        label: 'Contenu',
        min: 1
    },
    image: {
        type: String,
        label: 'URL de l\'image',
        optional: true,
        regEx: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    },
    userId: {
        type: String,
        label: 'ID de l\'utilisateur',
        autoValue: function() {
            if (this.isInsert) {
                return this.userId;
            }
        }
    },
    author: {
        type: String,
        label: 'Auteur',
        autoValue: function() {
            if (this.isInsert) {
                const user = Meteor.users.findOne(this.userId);
                return user ? user.profile.firstname + ' ' + user.profile.name : 'Anonyme';
            }
        }
    },
    createdAt: {
        type: Date,
        label: 'Date de création',
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        }
    },
    updatedAt: {
        type: Date,
        label: 'Date de mise à jour',
        autoValue: function() {
            return new Date();
        }
    },
    status: {
        type: String,
        label: 'Statut',
        allowedValues: ['draft', 'published', 'archived'],
        defaultValue: 'draft'
    }
});

if (Meteor.isServer) {
    Meteor.methods({
        'posts.insert'(post) {
            check(post, {
                title: String,
                content: String,
                image: Match.Optional(String),
                status: Match.Optional(String)
            });

            // Validation avec SimpleSchema
            PostSchema.validate(post);

            // Vérification de l'authentification
            if (!this.userId) {
                throw new Meteor.Error('not-authorized', 
                    'Vous devez être connecté pour créer un post');
            }

            try {
                return Posts.insert({
                    ...post,
                    userId: this.userId,
                    createdAt: new Date()
                });
            } catch (error) {
                throw new Meteor.Error('validation-error', 
                    'Erreur lors de la création du post: ' + error.message);
            }
        },

        'posts.update'(postId, updates) {
            check(postId, String);
            check(updates, {
                title: Match.Optional(String),
                content: Match.Optional(String),
                image: Match.Optional(String),
                status: Match.Optional(String)
            });

            // Validation avec SimpleSchema
            PostSchema.validate(updates, { modifier: true });

            // Vérification de l'authentification
            if (!this.userId) {
                throw new Meteor.Error('not-authorized', 
                    'Vous devez être connecté pour modifier un post');
            }

            const post = Posts.findOne(postId);
            if (!post) {
                throw new Meteor.Error('not-found', 
                    'Post non trouvé');
            }

            // Vérification des droits
            if (post.userId !== this.userId) {
                throw new Meteor.Error('not-authorized', 
                    'Vous ne pouvez modifier que vos propres posts');
            }

            try {
                return Posts.update(postId, {
                    $set: {
                        ...updates,
                        updatedAt: new Date()
                    }
                });
            } catch (error) {
                throw new Meteor.Error('validation-error', 
                    'Erreur lors de la mise à jour du post: ' + error.message);
            }
        },

        'posts.remove'(postId) {
            check(postId, String);

            // Vérification de l'authentification
            if (!this.userId) {
                throw new Meteor.Error('not-authorized', 
                    'Vous devez être connecté pour supprimer un post');
            }

            const post = Posts.findOne(postId);
            if (!post) {
                throw new Meteor.Error('not-found', 
                    'Post non trouvé');
            }

            // Vérification des droits
            if (post.userId !== this.userId) {
                throw new Meteor.Error('not-authorized', 
                    'Vous ne pouvez supprimer que vos propres posts');
            }

            try {
                return Posts.remove(postId);
            } catch (error) {
                throw new Meteor.Error('remove-error', 
                    'Erreur lors de la suppression du post: ' + error.message);
            }
        }
    });

    // Publication des posts
    Meteor.publish('posts', function (options = {}) {
        check(options, {
            limit: Match.Optional(Number),
            skip: Match.Optional(Number),
            sort: Match.Optional(Object)
        });

        const query = {
            $or: [
                { status: 'published' },
                { userId: this.userId }
            ]
        };

        return Posts.find(query, options);
    });
}
