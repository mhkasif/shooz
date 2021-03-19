const mongoose = require("mongoose");
const validator=require('validator')

const shoesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Shoes must have title"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Shoes must have price"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
      validate:[validator.isAlpha,'color should be a alphabetic string']
    },
    model: {
      type: String,
    },
    sex: {
      type: String,
      enum: {
        values: ["male", "female", "unisex"],
        message: "sex should be either male,female or unisex",
      },
    },
    sku: {
      type: String,
      unique: true,
    },
    brand: {
      type: String,
    },
    availableQuantity: {
      type: Number,
    },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    coverImage: {
      type: String,
      required: [true, "A Shoe must have a Cover Image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    vipShoes: {
      type: Boolean,
      default: false,
    },
  }
);
//virtual property which does not reside in database
shoesSchema.virtual("gallery").get(function () {
  return [this.coverImage, ...this.images];
});
shoesSchema.virtual("onSale").get(function () {
  return this.discount>0;
});

// //middlewares

// //1)DOCUMENT MIDDLEWARE

// //only runs on save() and create()
// shoesSchema.pre("save", function (next) {
//   next();
// });
// shoesSchema.post("save", function (doc, next) {
//   next();
// });

// //2) Query Middleware
// shoesSchema.pre(/^find/, function (doc, next) {
//   //any query starting with find
//   //suppose we dont want them to see vvip shoes
//   // this.find({ vipShoes: { $ne: true } }); //shoes having vip field true
//   next();
// });

// //3 AGGREGATION
// shoesSchema.pre("aggregate", function (doc, next) {
//   //suppose we dont want them to see vvip shoes
//   // this.pipeline().unshift({ $match: { vipShoes: { $ne: true } } });
//   next();
// });
exports.Shoes = new mongoose.model("Shoe", shoesSchema);
