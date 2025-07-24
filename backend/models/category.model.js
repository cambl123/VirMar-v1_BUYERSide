import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true,
      unique: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true 
    },
    description: { 
      type: String, 
      trim: true 
    },
    
    // Category hierarchy - for subcategories
    parentCategory: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category",
      default: null 
    },
    
    // Category image for display
    image: String,
    
    // SEO and display
    metaTitle: String,
    metaDescription: String,
    
    // Category status
    isActive: { 
      type: Boolean, 
      default: true 
    },
    
    // Economic analytics for categories
    analytics: {
      totalProducts: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      averagePrice: { type: Number, default: 0 },
      conversionRate: { type: Number, default: 0 }
    },
    
    // Display order for frontend
    sortOrder: { 
      type: Number, 
      default: 0 
    }
  },
  { 
    timestamps: true 
  }
);

// Generate slug from name before saving
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    console.log(`📂 Category slug generated: ${this.slug}`);
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);
export default Category;