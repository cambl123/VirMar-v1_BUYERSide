import mongoose from "mongoose";

// Model to represent Rwandan administrative divisions
const locationSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      // required: true, 
      trim: true 
    },
    type: {
      type: String,
      enum: ["province", "district", "sector", "cell"],
      // required: true
    },
    
    // Parent-child relationship for hierarchy
    parent: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Location", 
      default: null 
    },
    
    // Unique identifier for each level (e.g., "Kigali", "Gasabo", "Remera", "Giporoso")
    slug: { 
      type: String, 
      // required: true, 
      unique: true, 
      lowercase: true 
    },
    
    // For cells, we might store coordinates for future radius-based delivery
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    
    // Metadata
    population: Number,
    area: Number, // in km²
    
    // For easy lookup of full path
    fullPath: { 
      type: String, 
      unique: true 
    } // e.g., "Kigali/Gasabo/Remera/Giporoso"
  },
  { 
    timestamps: true,
    indexes: [
      { type: 1, name: 1 },
      { parent: 1 },
      { fullPath: 1 }
    ]
  }
);

// Pre-save hook to generate slug and fullPath
locationSchema.pre("save", async function (next) {
  if (this.isModified("name") || this.isModified("parent")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (this.parent) {
      const parentLocation = await mongoose.model("Location").findById(this.parent);
      if (parentLocation) {
        this.fullPath = `${parentLocation.fullPath}/${this.name}`;
      } else {
        this.fullPath = this.name; // Should not happen if parent is valid
      }
    } else {
      this.fullPath = this.name;
    }
    console.log(`📍 Location path generated: ${this.fullPath}`);
  }
  next();
});

const Location = mongoose.model("Location", locationSchema);
export default Location;