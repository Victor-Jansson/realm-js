////////////////////////////////////////////////////////////////////////////
//
// Copyright 2022 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import { expect } from "chai";
import { inspect } from "util";

import {
  ObjectSchema as BindingObjectSchema,
  Property as BindingProperty,
  PropertyType as BindingPropertyType,
  ColKey,
  TableKey,
  TableType,
} from "../binding";
import { CanonicalObjectSchema, CanonicalPropertySchema } from "../schema";
import { fromBindingObjectSchema, fromBindingPropertySchema } from "../schema/from-binding";

const columnKey = { value: 0n } as unknown as ColKey;
const tableKey = { value: 0 } as unknown as TableKey;

describe("schema-utils", () => {
  describe("transformPropertySchema", () => {
    const TESTS: [BindingProperty, CanonicalPropertySchema][] = [
      [
        {
          name: "prop",
          type: BindingPropertyType.Int,
          columnKey,
          isIndexed: false,
          isFulltextIndexed: false,
          isPrimary: false,
          linkOriginPropertyName: "",
          objectType: "",
          publicName: "",
        },
        { name: "prop", type: "int", optional: false, mapTo: "prop", indexed: false },
      ],
      [
        {
          name: "prop",
          type: BindingPropertyType.Int | BindingPropertyType.Nullable,
          columnKey,
          isIndexed: false,
          isFulltextIndexed: false,
          isPrimary: false,
          linkOriginPropertyName: "",
          objectType: "",
          publicName: "",
        },
        { name: "prop", type: "int", optional: true, mapTo: "prop", indexed: false },
      ],
      [
        {
          name: "prop",
          type: BindingPropertyType.String,
          columnKey,
          isIndexed: false,
          isFulltextIndexed: false,
          isPrimary: false,
          linkOriginPropertyName: "",
          objectType: "",
          publicName: "",
        },
        { name: "prop", type: "string", optional: false, mapTo: "prop", indexed: false },
      ],
      [
        {
          name: "prop",
          type: BindingPropertyType.String | BindingPropertyType.Nullable,
          columnKey,
          isIndexed: false,
          isFulltextIndexed: false,
          isPrimary: false,
          linkOriginPropertyName: "",
          objectType: "",
          publicName: "",
        },
        { name: "prop", type: "string", optional: true, mapTo: "prop", indexed: false },
      ],
    ];
    for (const [input, expectedSchema] of TESTS) {
      it("transforms " + inspect(input, { compact: true, breakLength: Number.MAX_SAFE_INTEGER }), () => {
        const schema = fromBindingPropertySchema(input);
        expect(schema).deep.equals(expectedSchema);
      });
    }
  });

  describe("transformObjectSchema", () => {
    const TESTS: [BindingObjectSchema, CanonicalObjectSchema][] = [
      [
        {
          name: "Person",
          tableType: TableType.TopLevel,
          persistedProperties: [
            {
              name: "name",
              type: BindingPropertyType.String,
              columnKey,
              isIndexed: false,
              isFulltextIndexed: false,
              isPrimary: false,
              linkOriginPropertyName: "",
              objectType: "",
              publicName: "",
            },
            {
              name: "friends",
              type: BindingPropertyType.Object ^ BindingPropertyType.Array,
              objectType: "Person",
              columnKey,
              isIndexed: false,
              isFulltextIndexed: false,
              isPrimary: false,
              linkOriginPropertyName: "",
              publicName: "",
            },
          ],
          computedProperties: [],
          primaryKey: "",
          alias: "",
          tableKey,
        },
        {
          ctor: undefined,
          embedded: false,
          asymmetric: false,
          name: "Person",
          properties: {
            name: { name: "name", type: "string", optional: false, mapTo: "name", indexed: false },
            friends: {
              name: "friends",
              type: "list",
              optional: false,
              mapTo: "friends",
              objectType: "Person",
              indexed: false,
            },
          },
        },
      ],
    ];
    for (const [input, expectedSchema] of TESTS) {
      it("transforms " + inspect(input, { compact: true, breakLength: Number.MAX_SAFE_INTEGER }), () => {
        const schema = fromBindingObjectSchema(input);
        expect(schema).deep.equals(expectedSchema);
      });
    }
  });
});
