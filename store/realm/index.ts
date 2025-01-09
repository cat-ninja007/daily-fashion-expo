import Realm, { Configuration } from "realm";
import { ProductSchema } from "./ProductSchema";

// Define the schema configuration with type annotations
const config: Configuration = {
  schema: [ProductSchema],
  schemaVersion: 2, // Increment the schema version
  onMigration: (oldRealm: Realm, newRealm: Realm) => {
    const oldObjects = oldRealm.objects("Product");
    const newObjects = newRealm.objects("Product");

    // Update each existing object to comply with the new schema
    for (let i = 0; i < oldObjects.length; i++) {
      if (oldObjects[i].price === undefined) {
        newObjects[i].price = null; // Or use 0 if you want a default value
      }
    }
  },
}

const realm = new Realm(config);

export default realm;
