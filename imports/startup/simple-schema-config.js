import SimpleSchema from 'simpl-schema';

// Configuration globale de SimpleSchema
SimpleSchema.defineValidationErrorTransform((error) => error);
SimpleSchema.extendOptions(['autoform']); 