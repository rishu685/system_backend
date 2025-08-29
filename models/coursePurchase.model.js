import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:[true, 'Course reference is required']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'User reference is required']
    },
    amount:{
        type:Number,
        required:[true, 'Purchase amount is required'],
        min:[0, 'Amount must be non-negative']
    },
    currency:{
        type:String,
        required:[true, 'Currency is required'],
        uppercase:true,
        default:'USD'
    },
    status:{
        type:String,
        enum:{
            values:['pending', 'completed', 'failed', 'refunded'],
            message:'Please select a valid status'
        },
        default:'pending'
    },
    paymentMethod:{
        type:String,
        required:[true, 'Payment method is required']
    },
    paymentId:{
        type:String,
        required:[true, 'Payment ID is required']
    },
    refundId:{
        type:String
    },
    refundAmount:{
        type:Number,
        min:[0, 'Refund amount must be non-negative']
    },
    refundReason:{
        type:String
    },
    metadata:{
        type:Map,
        of:String
    }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

// Index for faster queries
coursePurchaseSchema.index({user:1,course:1});
coursePurchaseSchema.index({status:1});
coursePurchaseSchema.index({createdAt:-1});

// Virtual field to check if purchase is refundable (within 30 days)
coursePurchaseSchema.virtual('isRefundable').get(function(){
    if(this.status!=='completed')return false;
    const thirtyDaysAgo=new Date(Date.now()-30*24*60*60*1000);
    return this.createdAt>thirtyDaysAgo;
});

// Method to process refund
coursePurchaseSchema.methods.processRefund=async function(reason,amount){
    this.status='refunded';
    this.refundReason=reason;
    this.refundAmount=amount||this.amount;
    return this.save();
};

export const CoursePurchase=mongoose.model('CoursePurchase',coursePurchaseSchema);