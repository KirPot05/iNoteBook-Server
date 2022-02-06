import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const notesSchema = new Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    title:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true,
    },

    tag:{
        type: String,
        default: "General"
    },

    date:{
        type: Date,
        default: Date.now
    },

});

const Notes = new model('notes', notesSchema);
export default Notes;
