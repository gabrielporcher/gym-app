// UUIDs gerados uma vez. Não regenerar: a migration de INSERT usa os mesmos ids.

export const CATALOG_SEEDED_AT = '2026-10-09T13:00:00.000Z';

export type EquipmentCode =
  | 'barbell'
  | 'ez-bar'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'smith'
  | 'trap-bar';

export type LoadTypeCode = 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable';

export type CatalogSeedMuscleGroup = {
  id: string;
  name: string;
  sortOrder: number;
};

export type CatalogSeedMuscle = {
  id: string;
  muscleGroupId: string;
  name: string;
  sortOrder: number;
};

export type CatalogSeedAlias = {
  id: string;
  alias: string;
};

export type CatalogSeedRecruitment = {
  id: string;
  muscleId: string;
  recruitment: 1 | 2 | 3 | 4 | 5;
};

export type CatalogSeedExercise = {
  id: string;
  name: string;
  aliases: CatalogSeedAlias[];
  equipment: EquipmentCode;
  loadType: LoadTypeCode;
  kind: 'compound' | 'isolation';
  unilateral: boolean;
  ownerId: null;
  recruitment: CatalogSeedRecruitment[];
};

export const catalogMuscleGroups: CatalogSeedMuscleGroup[] = [
  {
    "id": "62d33771-b707-4a88-b2e3-091d76c420d0",
    "name": "Peito",
    "sortOrder": 1
  },
  {
    "id": "83ca645e-92d6-47fb-91ab-6318ebcf3119",
    "name": "Costas",
    "sortOrder": 2
  },
  {
    "id": "c82d24fa-c058-42f7-862b-d36496912ccc",
    "name": "Ombros",
    "sortOrder": 3
  },
  {
    "id": "7f6ea116-81a2-4f40-9ff5-d12c92c8e67f",
    "name": "Bíceps",
    "sortOrder": 4
  },
  {
    "id": "a4e19abe-f3c5-4878-b6e0-175ccbe0aa12",
    "name": "Tríceps",
    "sortOrder": 5
  },
  {
    "id": "10f25115-c9ee-48f6-88c4-db96c88702db",
    "name": "Antebraço",
    "sortOrder": 6
  },
  {
    "id": "19931aa9-5729-464b-8652-6c6f443b0c49",
    "name": "Quadríceps",
    "sortOrder": 7
  },
  {
    "id": "be52bb1a-ade9-494a-bc9d-60a3fb78fff4",
    "name": "Posterior de coxa",
    "sortOrder": 8
  },
  {
    "id": "cd5f9a84-4ad1-4291-896b-2addf65eab7d",
    "name": "Glúteos",
    "sortOrder": 9
  },
  {
    "id": "48ec0fb5-1115-45a6-97cf-41688fd7300e",
    "name": "Adutores",
    "sortOrder": 10
  },
  {
    "id": "9fa5af88-1d59-4a8b-8cf4-85b46eebb38d",
    "name": "Panturrilhas",
    "sortOrder": 11
  },
  {
    "id": "f99cc466-013e-4a1b-b6fd-5f5b022c5a18",
    "name": "Abdômen",
    "sortOrder": 12
  }
];

export const catalogMuscles: CatalogSeedMuscle[] = [
  {
    "id": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
    "muscleGroupId": "62d33771-b707-4a88-b2e3-091d76c420d0",
    "name": "Peitoral superior",
    "sortOrder": 1
  },
  {
    "id": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
    "muscleGroupId": "62d33771-b707-4a88-b2e3-091d76c420d0",
    "name": "Peitoral médio-inferior",
    "sortOrder": 2
  },
  {
    "id": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
    "muscleGroupId": "83ca645e-92d6-47fb-91ab-6318ebcf3119",
    "name": "Latíssimo do dorso",
    "sortOrder": 1
  },
  {
    "id": "c9693730-31b4-4c14-96f5-33685eb0131b",
    "muscleGroupId": "83ca645e-92d6-47fb-91ab-6318ebcf3119",
    "name": "Romboides",
    "sortOrder": 2
  },
  {
    "id": "345476b0-bf96-402b-b063-00ff72a8bcbe",
    "muscleGroupId": "83ca645e-92d6-47fb-91ab-6318ebcf3119",
    "name": "Trapézio superior",
    "sortOrder": 3
  },
  {
    "id": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
    "muscleGroupId": "83ca645e-92d6-47fb-91ab-6318ebcf3119",
    "name": "Trapézio médio",
    "sortOrder": 4
  },
  {
    "id": "df609386-4f4c-4223-a935-1d32e440a5ed",
    "muscleGroupId": "83ca645e-92d6-47fb-91ab-6318ebcf3119",
    "name": "Trapézio inferior",
    "sortOrder": 5
  },
  {
    "id": "c64db953-6ebc-424d-8184-6eac22cc4f69",
    "muscleGroupId": "83ca645e-92d6-47fb-91ab-6318ebcf3119",
    "name": "Eretor da espinha",
    "sortOrder": 6
  },
  {
    "id": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
    "muscleGroupId": "c82d24fa-c058-42f7-862b-d36496912ccc",
    "name": "Deltoide anterior",
    "sortOrder": 1
  },
  {
    "id": "0f8e95ce-18df-4608-a813-c67eea66ce1f",
    "muscleGroupId": "c82d24fa-c058-42f7-862b-d36496912ccc",
    "name": "Deltoide lateral",
    "sortOrder": 2
  },
  {
    "id": "82d98d85-015c-453e-9af2-a9953b68114f",
    "muscleGroupId": "c82d24fa-c058-42f7-862b-d36496912ccc",
    "name": "Deltoide posterior",
    "sortOrder": 3
  },
  {
    "id": "3fadeb96-6a0a-433f-a590-18167d929d05",
    "muscleGroupId": "7f6ea116-81a2-4f40-9ff5-d12c92c8e67f",
    "name": "Bíceps braquial",
    "sortOrder": 1
  },
  {
    "id": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
    "muscleGroupId": "7f6ea116-81a2-4f40-9ff5-d12c92c8e67f",
    "name": "Braquial",
    "sortOrder": 2
  },
  {
    "id": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
    "muscleGroupId": "a4e19abe-f3c5-4878-b6e0-175ccbe0aa12",
    "name": "Tríceps cabeça longa",
    "sortOrder": 1
  },
  {
    "id": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
    "muscleGroupId": "a4e19abe-f3c5-4878-b6e0-175ccbe0aa12",
    "name": "Tríceps cabeça lateral",
    "sortOrder": 2
  },
  {
    "id": "300223ec-9001-4f15-9544-896d7d064ad1",
    "muscleGroupId": "a4e19abe-f3c5-4878-b6e0-175ccbe0aa12",
    "name": "Tríceps cabeça medial",
    "sortOrder": 3
  },
  {
    "id": "f4798475-3c7b-4637-95bd-5767e14ac27f",
    "muscleGroupId": "10f25115-c9ee-48f6-88c4-db96c88702db",
    "name": "Braquiorradial",
    "sortOrder": 1
  },
  {
    "id": "f741fdb9-62ac-40d2-996d-c6951cf1d780",
    "muscleGroupId": "10f25115-c9ee-48f6-88c4-db96c88702db",
    "name": "Flexores do punho",
    "sortOrder": 2
  },
  {
    "id": "6295b835-a096-4f8c-81d0-7597e0acea72",
    "muscleGroupId": "10f25115-c9ee-48f6-88c4-db96c88702db",
    "name": "Extensores do punho",
    "sortOrder": 3
  },
  {
    "id": "cdc2a622-6050-4f05-a58d-e65680e25010",
    "muscleGroupId": "19931aa9-5729-464b-8652-6c6f443b0c49",
    "name": "Reto femoral",
    "sortOrder": 1
  },
  {
    "id": "810a947d-d094-4d3b-8f18-aa653ea82f24",
    "muscleGroupId": "19931aa9-5729-464b-8652-6c6f443b0c49",
    "name": "Vastos do quadríceps",
    "sortOrder": 2
  },
  {
    "id": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
    "muscleGroupId": "be52bb1a-ade9-494a-bc9d-60a3fb78fff4",
    "name": "Bíceps femoral",
    "sortOrder": 1
  },
  {
    "id": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
    "muscleGroupId": "be52bb1a-ade9-494a-bc9d-60a3fb78fff4",
    "name": "Semitendíneo e semimembranoso",
    "sortOrder": 2
  },
  {
    "id": "fc422486-f39e-4b48-a48c-f240e2da670b",
    "muscleGroupId": "cd5f9a84-4ad1-4291-896b-2addf65eab7d",
    "name": "Glúteo máximo",
    "sortOrder": 1
  },
  {
    "id": "700180ab-ded3-424a-9c8a-be84e26e5800",
    "muscleGroupId": "cd5f9a84-4ad1-4291-896b-2addf65eab7d",
    "name": "Glúteo médio",
    "sortOrder": 2
  },
  {
    "id": "335b2641-71dc-410b-aa38-fce7f7347479",
    "muscleGroupId": "48ec0fb5-1115-45a6-97cf-41688fd7300e",
    "name": "Adutores",
    "sortOrder": 1
  },
  {
    "id": "03f6df50-200f-400d-adfc-d6ac134fe785",
    "muscleGroupId": "9fa5af88-1d59-4a8b-8cf4-85b46eebb38d",
    "name": "Gastrocnêmio",
    "sortOrder": 1
  },
  {
    "id": "614c3ac9-02f5-40d3-9480-d52fc676b462",
    "muscleGroupId": "9fa5af88-1d59-4a8b-8cf4-85b46eebb38d",
    "name": "Sóleo",
    "sortOrder": 2
  },
  {
    "id": "1d65abf4-d7b6-4147-aafd-d80083a04819",
    "muscleGroupId": "f99cc466-013e-4a1b-b6fd-5f5b022c5a18",
    "name": "Reto abdominal",
    "sortOrder": 1
  },
  {
    "id": "29491282-8d42-4cce-b007-0b4df0891bd7",
    "muscleGroupId": "f99cc466-013e-4a1b-b6fd-5f5b022c5a18",
    "name": "Oblíquos",
    "sortOrder": 2
  }
];

export const catalogExercises: CatalogSeedExercise[] = [
  {
    "id": "f33e45e0-2f56-4b13-b6ac-23fd6c6366f6",
    "name": "Supino reto com barra",
    "aliases": [
      {
        "id": "f66603f9-0a0b-47ee-b6c0-4736a6e8b85b",
        "alias": "Supino reto"
      },
      {
        "id": "e50b664d-d745-4ee0-8741-4764d0b3e7ac",
        "alias": "Supino com barra"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "ae7c7fd9-1bea-4a23-98fa-96195b094160",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 5
      },
      {
        "id": "40bcda89-98e3-4ebe-99b6-d4265b483c3e",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 3
      },
      {
        "id": "e4ecdea4-a128-4638-9891-b53f3c0471e1",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 3
      },
      {
        "id": "0af59a5a-7557-4d45-93b0-adf872e95324",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "5488911f-12bf-4f0e-91df-328b89468ed7",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "5e2b9936-3331-4f82-9455-573a24190627",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "58e32b88-7dd7-42e1-a529-9d8458030721",
    "name": "Supino reto com halteres",
    "aliases": [
      {
        "id": "d36d9879-2fc9-4f68-880b-7f8638126e6a",
        "alias": "Supino com halteres"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "5d71e580-1397-4159-8c21-3706612c454e",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 5
      },
      {
        "id": "22fc3ff0-478c-4f83-9ce9-45896597eda8",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 3
      },
      {
        "id": "ebdd28b3-2787-41c8-9bc8-641dbd186b9f",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 3
      },
      {
        "id": "2994eda6-2218-42a9-a8ee-b1f3e0e5640b",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "e7ce1a6f-c5df-466e-8cc1-6656f0318a97",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "c0a52856-7c13-49e6-9139-963a2f6b15af",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "8e218ead-628d-4dae-9779-9e36ab050da1",
    "name": "Supino inclinado com barra",
    "aliases": [
      {
        "id": "20c12d4f-04d4-410f-a53a-73c429eef81a",
        "alias": "Supino inclinado"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "d15604e1-082b-459f-bbc3-e0a32e213ff2",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 5
      },
      {
        "id": "58816369-9ac9-4c53-a730-996e40d146e4",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 3
      },
      {
        "id": "dbb92961-f449-439b-9579-68287289ad08",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 4
      },
      {
        "id": "0feac0e6-89a8-48e5-ae91-8cd986f0de08",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "08070546-d7bb-4529-866f-f442edcf3e14",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "9ed73e57-c71a-461a-bb10-ea97fd57c45f",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "273746ab-f0e9-4ddf-adbd-c10505987e82",
    "name": "Supino inclinado com halteres",
    "aliases": [
      {
        "id": "13711fa3-f790-4ea6-93f4-0811c1263f47",
        "alias": "Supino inclinado com halter"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "a053bee9-0c11-498d-a3ac-903ad02cb3d9",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 5
      },
      {
        "id": "aa7a7963-d4ba-412b-a699-1bfcdaa9eea4",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 3
      },
      {
        "id": "4060e27b-88d4-4bdc-b6e8-cf56ec477075",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 4
      },
      {
        "id": "9f525b8b-3694-4e82-9c8d-1c27be47bf19",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "48f8ec1a-d066-4764-91e7-6717aeb36630",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 2
      },
      {
        "id": "2c566745-aa18-4e68-b58a-94b3c2d48908",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "268c7a0c-69c9-4af9-82c7-35a0f4df5483",
    "name": "Supino declinado com barra",
    "aliases": [
      {
        "id": "0a600fb9-c7b7-4728-a215-58b1c103506a",
        "alias": "Supino declinado"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "c659797b-0722-42b9-8ce5-d57c927b8886",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 5
      },
      {
        "id": "b3c34935-52ec-44fc-b77a-fa46967d4a4c",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 2
      },
      {
        "id": "017cff2f-b246-4d27-8353-b61cea278cc0",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 2
      },
      {
        "id": "b120335c-eb66-430f-933d-facfd1f6f5f1",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "d47095df-006a-4f9b-89de-ccb5ffa93c24",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "847ed9b3-e48c-45e0-a399-ed6d2478279f",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "f6aaa1d2-7373-4e38-aa33-0400c2288219",
    "name": "Supino declinado com halteres",
    "aliases": [
      {
        "id": "b0058c35-00c6-4f75-85af-784e149cfb09",
        "alias": "Supino declinado com halter"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "f4c666cc-c82e-4583-afd8-08faba0251b3",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 5
      },
      {
        "id": "97fb1f5f-e9af-4f9b-89d7-b5ead447a1da",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 2
      },
      {
        "id": "50dc8fc6-721f-414d-9104-960ef46b0d59",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 2
      },
      {
        "id": "5dfff2bb-ab69-480e-85d2-8072e22ce7d7",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "2c7fc8b4-4d73-460f-889f-026124d6f1ce",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "71183182-9ff5-421b-90a6-85ad64c022a3",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "9c2580da-a0f7-411a-ba5a-751a68526361",
    "name": "Supino fechado com barra",
    "aliases": [
      {
        "id": "1c5e504d-e477-46cc-9e3e-395aeb77e2cd",
        "alias": "Supino pegada fechada"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "4363e3b7-a1b1-4e7d-a5d2-a29863ef2f6c",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 5
      },
      {
        "id": "056571d6-e52c-4a01-99c1-4ad75dd2c62d",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 4
      },
      {
        "id": "4104a5fe-d747-4637-b55a-a26f4a992665",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 4
      },
      {
        "id": "ffcd531c-99c3-462c-bb52-bff8c8dcc5c5",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 4
      },
      {
        "id": "a2667068-50fc-43b1-9699-10b5f5e3172a",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 2
      },
      {
        "id": "b033c03a-5c5c-4f42-b0d3-cba0166faff0",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "f7955d58-79ca-45c1-aea1-74b518c65344",
    "name": "Supino na máquina",
    "aliases": [
      {
        "id": "451557a8-41c0-403a-a1cb-7b25dee5ec98",
        "alias": "Supino articulado"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "908d64d1-c147-4916-8e08-2f4a151f0cee",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 5
      },
      {
        "id": "cb21d544-0f93-4662-b698-fbd0a86646cf",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 3
      },
      {
        "id": "de66db66-b25d-499e-9d2c-69968745f99f",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 3
      },
      {
        "id": "5d383119-1c1f-4b92-89a0-fb9f2fa03746",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "e7e576c8-4408-4269-8e22-41d6c2ae36da",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "b16db394-0155-4af9-9927-a9dc690f7616",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "2c8ea29b-89f0-4286-a4e8-91781494bd13",
    "name": "Supino inclinado na máquina",
    "aliases": [
      {
        "id": "de7eded4-0e81-4b05-a205-3df21e4bd1dd",
        "alias": "Supino inclinado articulado"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "f153895c-a0e5-4656-94d4-fb11b1b9ad2e",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 5
      },
      {
        "id": "6e173687-27c4-4577-9d84-5e0d33474265",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 3
      },
      {
        "id": "b01e619e-a21d-478c-aae0-0786fe844f0a",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 4
      },
      {
        "id": "5e1d5e49-c028-47ac-8bb9-e83117d76eb6",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "efad2081-40a0-4489-8fc7-fffbf14dd0d3",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "e8361e30-865d-4887-8a66-1a38b4792bef",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "3a081b85-db7e-46a2-8e56-547baeeac78d",
    "name": "Crucifixo reto com halteres",
    "aliases": [
      {
        "id": "630c7a74-d878-484e-9ff9-8d54461befc2",
        "alias": "Crucifixo"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "b46243ff-de35-4f7d-beab-1302dd769429",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 5
      },
      {
        "id": "f466937d-9fe8-4f75-81c3-43b8274117d7",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 3
      },
      {
        "id": "ced97c2b-a209-4036-92df-a72acb0a833c",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "f4d338df-7298-4e6c-9b13-60c44165b321",
    "name": "Crucifixo inclinado com halteres",
    "aliases": [
      {
        "id": "30acf5e1-1f48-49c6-b0d4-456e81e90ec6",
        "alias": "Crucifixo inclinado"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "38a27ca2-e43a-45f0-a55d-2990c95d84ec",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 5
      },
      {
        "id": "eb0035cd-b50e-4e40-94ee-5dc6f1915986",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 3
      },
      {
        "id": "bb22b91a-cdf0-49f3-b00e-ed4212d7ba8a",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "9a07c2ba-505b-44a2-b5ac-67aed60c01ab",
    "name": "Voador",
    "aliases": [
      {
        "id": "80ebf5e0-e10c-4985-8dcd-85164d7b470f",
        "alias": "Peck deck"
      },
      {
        "id": "ce295220-394f-4727-a7bd-f831caa29f15",
        "alias": "Crucifixo na máquina"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "695bb811-adb4-46fb-a503-8ca0a251db56",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 5
      },
      {
        "id": "af6907ce-0157-4ee0-8e74-7c608b059545",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 4
      },
      {
        "id": "d35c7522-e90b-4eac-82d6-8bcdba415e20",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "e8b6e569-c8be-4d28-912c-6eef1646dc41",
    "name": "Crossover na polia",
    "aliases": [
      {
        "id": "74df2694-eb11-4d01-baf5-e179757c3c4c",
        "alias": "Crossover"
      },
      {
        "id": "300407b2-1114-4dd1-8036-f5a9d7cdbda6",
        "alias": "Crucifixo no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "cae81d5f-ba00-401a-8e10-1acad04b104a",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 5
      },
      {
        "id": "c205c2d1-6b55-4022-bcd8-8f72d9b3877d",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 3
      },
      {
        "id": "75f15e99-2909-448d-a98d-16fa3454102d",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "1e7e817a-2cd4-4033-8235-0dbfbdd5487f",
    "name": "Crossover de baixo para cima",
    "aliases": [
      {
        "id": "fbd58fa5-e3cf-41a7-83d4-b450d1eb0e0f",
        "alias": "Crossover inferior"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "0332ef2c-a1e9-404e-96ab-f2c50d3c759f",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 5
      },
      {
        "id": "27835804-4d00-4ea0-81d9-9d2a865470f2",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 3
      },
      {
        "id": "915ccaa1-e5eb-4fe0-ad1b-78e15290fd9c",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "8fa6c907-4566-44fe-9bd0-3987965752fe",
    "name": "Flexão de braços",
    "aliases": [
      {
        "id": "545c8bab-ab5b-44cc-baf9-cee7a20b9be2",
        "alias": "Flexão"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "edda50db-cf72-4b3c-9bd2-013f9ca3fb8e",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 5
      },
      {
        "id": "64a3330f-6a0a-4329-bde6-a1027c9101e4",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 3
      },
      {
        "id": "eed4839e-335f-4d29-905c-6ba9725b1bd9",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 3
      },
      {
        "id": "0495b81c-70a0-4a3c-8148-f2bce22ec5ed",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "9c1af235-4e74-45ea-9766-19a37ebe3e1f",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "46efb9e7-6259-4994-9887-09aecfae864e",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "ecce2285-e749-46aa-9c88-977266735da6",
    "name": "Flexão de braços declinada",
    "aliases": [
      {
        "id": "77704e2c-03ea-43a0-9bad-de62bc563617",
        "alias": "Flexão com pés elevados"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "91ddd49e-2186-4aac-bb6d-26aaaf0d5f51",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 5
      },
      {
        "id": "7ff6e6fd-396c-448c-ae0d-41de5bdbfda2",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 3
      },
      {
        "id": "585f3a25-d4a2-4f8d-9cf6-1d9e355d909d",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 4
      },
      {
        "id": "95c53bb7-a881-44ed-9fa9-df13c01deaa6",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "a4fe9e1b-7b94-4139-b4ad-aa93b3807518",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "0806f928-0124-44da-b8cd-8a1618041fbf",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "689d00c6-d6aa-40d2-9ba7-8dd1f1e273be",
    "name": "Paralelas",
    "aliases": [
      {
        "id": "567ac24b-afc5-451a-a268-0da17f3adc99",
        "alias": "Mergulho nas paralelas"
      },
      {
        "id": "9fbf8840-6bde-4ab0-8040-d8ee98699846",
        "alias": "Dips"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "3b4141fe-fdf5-4acb-89c8-d25f5dd8d3c5",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 5
      },
      {
        "id": "8d6f471c-22f2-4317-b41b-7b5606fe468a",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 3
      },
      {
        "id": "d90f4633-7ec2-4b48-a74e-31ba1d06ceb3",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 4
      },
      {
        "id": "e39ad42d-a0a1-4487-b406-dca32d06be38",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 4
      },
      {
        "id": "5813c170-3890-4d55-a8b5-a48c4a7aaece",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 3
      },
      {
        "id": "08d2ee99-316e-469f-a950-208a9764c6f5",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "7699f859-5096-46ba-866b-6383913c3c25",
    "name": "Pullover com halter",
    "aliases": [
      {
        "id": "43743faa-190a-4c55-b1f1-3291df5f203a",
        "alias": "Pullover"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "93300d4f-5efb-42b0-9056-9fe827575fd3",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "ce6150d9-0f25-431e-a513-5473da27501f",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 4
      },
      {
        "id": "499212cd-95cf-43d0-b9fc-8baf5128d2e5",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "515af0fc-c730-449c-8a44-c4985c7d605d",
    "name": "Puxada frontal",
    "aliases": [
      {
        "id": "1791bf88-510d-4893-8699-559003e54331",
        "alias": "Puxada aberta"
      },
      {
        "id": "e5dcdd03-e824-4d66-aeb8-b5b9f54cdd4e",
        "alias": "Lat pulldown"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "06928874-5742-4d81-8a9b-875203b043dc",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "6d6fe5fd-dc80-4624-b50d-7d56512e89cb",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 3
      },
      {
        "id": "2c18b868-c521-4dbc-9928-cc8e1a897347",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 3
      },
      {
        "id": "89ad1612-e566-4e63-9d57-2df5d0d32b14",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      },
      {
        "id": "9b320831-8f41-4b39-9be7-066775cda934",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "67585e87-18a9-470e-a6fc-85c3cc04bf17",
    "name": "Puxada com pegada supinada",
    "aliases": [
      {
        "id": "8d83b138-a494-4d32-891f-bd5e59f49933",
        "alias": "Puxada supinada"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "40f182cf-074c-4c5f-b451-6feb1b412c50",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "97496e4e-fdf7-46a4-a459-de85614260d4",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 4
      },
      {
        "id": "076181e0-88de-4b2e-bd9c-6ee9d0a607f9",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      },
      {
        "id": "1fd3cf2c-a5a2-41ff-b64f-97e67b3da36b",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 3
      },
      {
        "id": "ba0a3b18-5494-4692-846a-90e76afd699e",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "38910131-0ca2-45d6-8010-28b5807d25a3",
    "name": "Puxada com pegada neutra",
    "aliases": [
      {
        "id": "a2d74b1c-e90c-4bcc-983d-5bc9f79a498c",
        "alias": "Puxada neutra"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "c75e1127-2835-492f-b2fb-ae3b3a246868",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "6a0e55a9-5196-430e-bf02-eff459745da4",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      },
      {
        "id": "1df1b352-a7b6-4093-a72d-ee416d0a180f",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      },
      {
        "id": "44e4f57f-211d-47d4-8423-0ed3400812fa",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 3
      },
      {
        "id": "94b3ba9f-6974-445d-8c81-88dcb28a377a",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "1f855236-fec2-403f-838d-be40dbc3e41c",
    "name": "Puxada unilateral",
    "aliases": [
      {
        "id": "a66dc044-b80c-4856-a9f8-a0e259fdc5d7",
        "alias": "Puxada unilateral no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "compound",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "07069a32-2b2a-4808-8b77-fdb07892c08e",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "9db68af1-e359-475f-8dcc-46f3e50b8871",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 3
      },
      {
        "id": "0a8db975-3ef4-4d0b-b9a3-d586fd6688f6",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 3
      },
      {
        "id": "65ced2f1-392f-4820-a4ba-ec9ee53aa9aa",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      },
      {
        "id": "0c0dc7f6-a6d5-41d0-a657-fc5a9ef83873",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "719d5a26-fc44-4ee5-b709-b65c1c74fad2",
    "name": "Barra fixa",
    "aliases": [
      {
        "id": "2f2b55a0-0369-49a7-b31b-d40be1819eb1",
        "alias": "Barra fixa pronada"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "4e2c6e4e-148b-4223-8241-3150183c22f3",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "3cc07fe8-2d56-478d-830e-c83abcff5bde",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 3
      },
      {
        "id": "935648a2-189f-49d3-9480-0f0c4331f15d",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 3
      },
      {
        "id": "94bfe4ea-bfd3-4eec-9032-b34d392d7ba9",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      },
      {
        "id": "c7500f00-ca46-49cc-a519-5488db708baf",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "c2c1663b-d445-4ba9-b142-a46d4f714067",
    "name": "Barra fixa supinada",
    "aliases": [
      {
        "id": "aa939709-4235-41d9-b37a-1206cbbe545d",
        "alias": "Chin-up"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "eb6fd8c4-2dda-4bb1-a94b-5fb0a9036097",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "cd36b6b4-d884-43d1-8a80-6e4fa39ef7a8",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 4
      },
      {
        "id": "98af76e5-5c39-40ee-bce1-a68188ba70fa",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      },
      {
        "id": "d4aca92a-6d6f-4542-b814-2bbad09d051d",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 2
      },
      {
        "id": "f1ded0b6-5b98-4e9f-98ef-01d979b961d7",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "221a6e22-6596-49ec-96e5-751bdb670f82",
    "name": "Barra fixa com pegada neutra",
    "aliases": [
      {
        "id": "e88033ff-0c46-4ac1-984f-3e91ff118957",
        "alias": "Barra fixa neutra"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "7ce474a9-3542-4e5b-89f4-8fa3cfa1412f",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "8da6563c-d922-45e9-9c01-f0dd27c4fcbe",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      },
      {
        "id": "10031942-f97e-4f2a-97f8-e93fb937aaf8",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      },
      {
        "id": "2897af86-0d6c-4a15-89d0-8a060bf6f25e",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 3
      },
      {
        "id": "e9f4d022-adfa-433e-90f1-8a60b7346d00",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "012a163b-4da5-4a8d-8b69-691ffdc6ab01",
    "name": "Remada curvada com barra",
    "aliases": [
      {
        "id": "ee83cf4b-e1e9-4856-873a-12349f7fad11",
        "alias": "Remada curvada"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "8b5b90bb-6533-4fee-9d72-6bc0e87e794c",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "a50b7e3d-7f1c-4b0f-a3cb-2be43048bef2",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 4
      },
      {
        "id": "a77f98ed-d8e0-4477-b786-677c4a96adc4",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 4
      },
      {
        "id": "0b2fe5e5-231d-47be-b2a3-be31f6e990a3",
        "muscleId": "df609386-4f4c-4223-a935-1d32e440a5ed",
        "recruitment": 3
      },
      {
        "id": "bf15131d-19ad-4549-affc-81045a267c04",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      },
      {
        "id": "9615b9bf-dcd6-4151-8747-95501afe14c4",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 2
      },
      {
        "id": "456c530f-b1c6-4e78-be78-824868cc269a",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "9a00575a-97ef-4c15-8715-3f3090c0eae4",
    "name": "Remada curvada supinada",
    "aliases": [
      {
        "id": "4ecac634-276f-4ca7-8997-76541305ded9",
        "alias": "Remada supinada"
      },
      {
        "id": "97ab4199-1ffc-47d9-b2f8-12caa4f577d6",
        "alias": "Remada Yates"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "7ac1ad2a-ea31-4f1c-a357-0b739cffa686",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "8a8e0919-0c08-49c3-bc1c-8cc6a58a51f3",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 4
      },
      {
        "id": "31ebe044-903a-4ce9-b5ed-aa5ac3454305",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      },
      {
        "id": "0824539f-8d9d-423b-81a1-1317b3e0da4d",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 4
      },
      {
        "id": "84934132-2ae6-44ff-a043-5a6a9c6b0194",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 3
      },
      {
        "id": "15c92949-53d6-41fb-9ff6-68710f571e46",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "017982e2-8ce5-4a3e-b161-579e7af2560a",
    "name": "Remada cavalinho",
    "aliases": [
      {
        "id": "e871e125-16cc-4b44-9464-0837053d4c2f",
        "alias": "Remada T"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "9b253d66-399f-4b25-8de2-ba80cbc86505",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "db8e3e5f-8338-43a2-ba96-d7c4b7e768d5",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 4
      },
      {
        "id": "fe8ca8a3-96d7-46db-805c-fe162895c276",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 4
      },
      {
        "id": "513a2e24-efe3-4c7d-b7c3-45e1a07bed47",
        "muscleId": "df609386-4f4c-4223-a935-1d32e440a5ed",
        "recruitment": 3
      },
      {
        "id": "d23e061c-6deb-4fab-8095-e3cc391416bc",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      },
      {
        "id": "5ce33963-6564-408c-ae39-6ad33b3e0a77",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "c8665b46-1339-4309-8e4b-b7a552fe9e37",
    "name": "Remada sentada no cabo",
    "aliases": [
      {
        "id": "854ac58e-f4f5-4061-bab5-1574beb409e7",
        "alias": "Remada baixa"
      },
      {
        "id": "15297d56-069d-4c86-b72a-67a7e876ee83",
        "alias": "Remada no pulley"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "66e81a5a-8ea3-4490-bff5-c60983b76720",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 5
      },
      {
        "id": "9748385c-a6e9-408d-8313-639c80b33e4c",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 4
      },
      {
        "id": "6962be67-fdde-404f-b1f5-2d7dc1280c48",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 4
      },
      {
        "id": "c2bb3a0e-fb4c-47d3-b62b-a38beb7c4102",
        "muscleId": "df609386-4f4c-4223-a935-1d32e440a5ed",
        "recruitment": 3
      },
      {
        "id": "3e7a04ad-555b-4efc-be44-140312ae742f",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      },
      {
        "id": "22322f15-c203-4b97-afaf-479e9c39f116",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "bc5a2d91-d08e-4931-9586-20d13ca88cca",
    "name": "Remada unilateral com halter",
    "aliases": [
      {
        "id": "ee1d72e8-e123-4f73-bddf-1dad0ff25bb9",
        "alias": "Remada serrote"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "compound",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "cd48276d-08e2-408a-8f00-b975a14b78d7",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "29db9009-e691-46c9-9913-220122047388",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 4
      },
      {
        "id": "499f63da-ac8e-416c-a571-e47d62ab69d1",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 3
      },
      {
        "id": "faff21c7-b28c-4b52-bf7b-f611a489a848",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      },
      {
        "id": "358e4c2b-08ea-4418-88df-0e9ff10b4b6b",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "b7ce23c1-8d4b-4b6e-918e-22c129a02373",
    "name": "Remada na máquina",
    "aliases": [
      {
        "id": "655b4eee-690e-475a-8a7a-af3325f6ebb5",
        "alias": "Remada articulada"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "f1f7a11b-1203-4acf-9e5a-0af670030f82",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 5
      },
      {
        "id": "e8fba21c-d7e0-4d8b-b702-726d647aa87e",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 4
      },
      {
        "id": "5d7dfef3-2d62-4e7b-bb52-a4c80ecb00e1",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 4
      },
      {
        "id": "fa77d725-9607-41d0-a143-7f1369eee43d",
        "muscleId": "df609386-4f4c-4223-a935-1d32e440a5ed",
        "recruitment": 3
      },
      {
        "id": "8dca889a-b58c-4d45-859d-6bfb3bea73bc",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "a4f7f139-0b93-45f7-b831-2e605649ea4e",
    "name": "Remada unilateral no cabo",
    "aliases": [
      {
        "id": "cd5f1035-0a21-4461-89cf-2d02033d07f7",
        "alias": "Remada serrote no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "compound",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "d5e2c17c-89b5-4881-90f3-29eea2c9d8d5",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "cdc1ee5d-8208-4446-bc27-b25d7e023907",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 4
      },
      {
        "id": "ee8b9c60-5480-43a6-a438-5f51897d698f",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 3
      },
      {
        "id": "8b9d3d7d-14e8-4735-aef7-0e5eaed15687",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "70ce1ddd-3dfe-4e59-b166-f5c2897e2b38",
    "name": "Pulldown com braços estendidos",
    "aliases": [
      {
        "id": "48bc7600-1cc0-481a-92d8-9f9fa7bcff79",
        "alias": "Pullover no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "c69795a4-41e5-4d3d-84f4-8d03c5155590",
        "muscleId": "57728d86-1f51-4d97-8d2d-8994d77e2b0f",
        "recruitment": 5
      },
      {
        "id": "1260e39a-ca20-4841-aac6-ab132c58df1a",
        "muscleId": "df609386-4f4c-4223-a935-1d32e440a5ed",
        "recruitment": 3
      },
      {
        "id": "f07457e1-ff14-4f26-b253-cb6eb49cbd8b",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "345ce997-cba7-4ce6-95ea-a78f0097f00f",
    "name": "Encolhimento com barra",
    "aliases": [],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "b21cd7a4-a6c7-495c-ade6-34f2763ab4f4",
        "muscleId": "345476b0-bf96-402b-b063-00ff72a8bcbe",
        "recruitment": 5
      }
    ]
  },
  {
    "id": "92662309-420b-4c64-954e-6803beef333c",
    "name": "Encolhimento com halteres",
    "aliases": [
      {
        "id": "88e3cc92-e6f8-4725-896f-da8be9f5d2d9",
        "alias": "Encolhimento com halter"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "20c10afb-f8b3-4ea0-ac86-669fc28f2da2",
        "muscleId": "345476b0-bf96-402b-b063-00ff72a8bcbe",
        "recruitment": 5
      }
    ]
  },
  {
    "id": "2d74f9a7-c171-45b7-a259-e5be6d181b99",
    "name": "Levantamento terra",
    "aliases": [
      {
        "id": "0e5be9e5-3cd0-4c69-9b26-4f2fea7ef8d6",
        "alias": "Terra convencional"
      },
      {
        "id": "43b16c72-f3d3-43b3-b0cb-8dc3fb7a9891",
        "alias": "Deadlift"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "de7b5292-a429-455c-b85c-7066c13511a1",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 5
      },
      {
        "id": "3d9e30cf-7e25-4573-9d36-263205512ef5",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 4
      },
      {
        "id": "396f53a5-45ea-4106-b71e-520654714e00",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 4
      },
      {
        "id": "1883373d-3a86-4669-87a9-2bee042355e9",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 4
      },
      {
        "id": "53f87720-8d9a-4414-8594-359597161d27",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 3
      },
      {
        "id": "59f5e237-84d2-454f-85be-accfb9efe217",
        "muscleId": "345476b0-bf96-402b-b063-00ff72a8bcbe",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "3550cec8-5a47-4331-8d59-d18410480a8b",
    "name": "Levantamento terra sumô",
    "aliases": [
      {
        "id": "d51f83e2-acb9-41c9-b35b-140444ea86c6",
        "alias": "Terra sumô"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "37393520-3941-4ad8-85e2-6f47dbaaa1a6",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 5
      },
      {
        "id": "e4cb3e86-050b-4cbf-9f58-4eb0abc67b59",
        "muscleId": "335b2641-71dc-410b-aa38-fce7f7347479",
        "recruitment": 4
      },
      {
        "id": "1cf8459b-71fb-40e4-ab0d-7bdf77ccc1b2",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 4
      },
      {
        "id": "10a48871-7c2d-4b8e-bc9d-8334fc1114dc",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 4
      },
      {
        "id": "99c3f712-e3d9-4142-8cb1-f8d2b71862e5",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 4
      },
      {
        "id": "dfc9a300-dbd7-4b9a-b96f-a458ea4cf8cb",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "d873b199-e134-4a46-8c1a-e341c16478e1",
    "name": "Levantamento terra com barra hexagonal",
    "aliases": [
      {
        "id": "283bfe20-a141-4db2-ba0d-51d5e98ba3a2",
        "alias": "Terra hexagonal"
      }
    ],
    "equipment": "trap-bar",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "3c0e7bc7-854a-4210-b2ca-58edb1b5cc09",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 5
      },
      {
        "id": "a5ec69eb-7261-4b7a-9c1a-92135a1a94e4",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 4
      },
      {
        "id": "31a45ecd-3341-455b-bdfd-5a96d6cb5a4d",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 4
      },
      {
        "id": "eab14afd-f96d-4569-9afc-3f77310c6fd4",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 3
      },
      {
        "id": "9e11ba24-bd6d-408c-baa7-ee5f070b32c6",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 3
      },
      {
        "id": "c32ed0bd-79dd-4b31-8fa2-6b768afe0246",
        "muscleId": "345476b0-bf96-402b-b063-00ff72a8bcbe",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "5c40356f-b4a9-4eab-9fd9-f31f99d6a107",
    "name": "Desenvolvimento com barra",
    "aliases": [
      {
        "id": "589b7ed3-b7f0-4715-85cb-bfcabced111f",
        "alias": "Desenvolvimento militar"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "4be7536b-df5a-4a87-941b-4d67d7e986f4",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 5
      },
      {
        "id": "1c4d626b-bb68-4aa0-ac47-9598f3ebf4af",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 4
      },
      {
        "id": "02673da4-9a1c-4197-9d87-6eeb41940d63",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "42838321-8ad4-4dda-be02-77d66004d2fb",
        "muscleId": "0f8e95ce-18df-4608-a813-c67eea66ce1f",
        "recruitment": 3
      },
      {
        "id": "310cdb46-b79a-46ae-b302-fa44bb89c552",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 3
      },
      {
        "id": "de7c9169-34f1-4756-af74-28cc4605d911",
        "muscleId": "345476b0-bf96-402b-b063-00ff72a8bcbe",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "6324f973-0578-4c92-9ec8-feb85a687386",
    "name": "Desenvolvimento com halteres",
    "aliases": [
      {
        "id": "6c775db5-d90b-4ee5-b0e2-e3163d8bf215",
        "alias": "Desenvolvimento"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "497b7a38-a2a5-42fd-abb6-2e23189327ef",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 5
      },
      {
        "id": "0b4673e5-1c41-4475-8f99-4bcd33a909ba",
        "muscleId": "0f8e95ce-18df-4608-a813-c67eea66ce1f",
        "recruitment": 4
      },
      {
        "id": "88da6b71-1c28-4ad2-a157-213aabd09fc6",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "a26666db-fd2b-4c9f-82d4-415e6b48fe21",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "cc5494ff-611b-47ec-a1d8-a5a6c6f81f0d",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "28d321f7-ebe0-47fa-8b09-0e6258ed38c2",
    "name": "Desenvolvimento na máquina",
    "aliases": [
      {
        "id": "8ac3da58-12db-4dde-ada3-8e0b7bb50bcb",
        "alias": "Desenvolvimento articulado"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "88ad4cab-d6d7-473e-8eb4-3b6956735422",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 5
      },
      {
        "id": "b77fd2c8-22ac-488b-8a51-c0cd34b55e7b",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 4
      },
      {
        "id": "9e930c84-768d-4424-80d8-e8f4748003f3",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "f3861e04-e2ed-483f-bfe9-05fbed1acd12",
        "muscleId": "0f8e95ce-18df-4608-a813-c67eea66ce1f",
        "recruitment": 3
      },
      {
        "id": "002015b9-8b0f-4dc4-8fef-114ff78b5f92",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "7f32acfc-48ed-4d07-b1bc-3478def8b2b3",
    "name": "Desenvolvimento Arnold",
    "aliases": [
      {
        "id": "4b30301c-b6d5-449a-930b-6e29790e98a0",
        "alias": "Arnold press"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "0f82d8f2-ecde-412d-8faf-8a143556e453",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 5
      },
      {
        "id": "084ae75e-4fab-4be4-8aea-758d6cde9c9d",
        "muscleId": "0f8e95ce-18df-4608-a813-c67eea66ce1f",
        "recruitment": 4
      },
      {
        "id": "87b85e68-c019-46a0-87fa-183c5e36c850",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "a7e1a603-73dc-4620-a601-114398d8ae72",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      },
      {
        "id": "3b23f50e-1052-4312-98e5-2329518d4957",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "bf1df8b8-4020-4560-80ce-58daa6a162d4",
    "name": "Elevação lateral com halteres",
    "aliases": [
      {
        "id": "e74c4ae5-ed2f-4e58-801c-f6366e6771a4",
        "alias": "Elevação lateral"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "8f2cc9a7-babb-409f-b6ca-1cd232f78644",
        "muscleId": "0f8e95ce-18df-4608-a813-c67eea66ce1f",
        "recruitment": 5
      },
      {
        "id": "0888be3d-97d9-4c19-8dde-d22286b0bd2d",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 2
      },
      {
        "id": "8b39393a-e0dd-48cc-853e-ee8f9d3659c2",
        "muscleId": "345476b0-bf96-402b-b063-00ff72a8bcbe",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "19b76a8b-ff4e-4bed-afed-099581177094",
    "name": "Elevação lateral no cabo",
    "aliases": [
      {
        "id": "e8c4db68-de0a-4825-b81f-e084a728013d",
        "alias": "Elevação lateral no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "c31f1b73-5cc6-4db2-b053-84d9bff3fe12",
        "muscleId": "0f8e95ce-18df-4608-a813-c67eea66ce1f",
        "recruitment": 5
      },
      {
        "id": "afb2130e-f4db-465f-8714-fc538c1e474f",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "3909c397-a976-49bd-92b5-ad39bf847657",
    "name": "Elevação lateral na máquina",
    "aliases": [
      {
        "id": "8334c8f8-2f14-4cb6-a76a-ffc527a6f589",
        "alias": "Elevação lateral na máquina"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "a7c24f17-6a5f-4ca9-ba26-627fc7f3534e",
        "muscleId": "0f8e95ce-18df-4608-a813-c67eea66ce1f",
        "recruitment": 5
      },
      {
        "id": "a25651d1-abda-402e-9048-588b64c1b50c",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "af1099b2-1b36-4ff5-9957-da9787829791",
    "name": "Elevação frontal com halteres",
    "aliases": [
      {
        "id": "48599220-8610-440a-9696-52d8095c3d59",
        "alias": "Elevação frontal"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "c72d4d04-522c-46a9-b042-b7c14045098f",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 5
      },
      {
        "id": "b23e103d-4261-4510-a3ed-dace4e9464b2",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "054b2f90-5781-4b0e-8e57-ab38d1d8a90d",
    "name": "Elevação frontal com barra",
    "aliases": [
      {
        "id": "1cfab97e-becd-4275-9145-8c97ed33dabc",
        "alias": "Elevação frontal com barra"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "e2f264b8-0dd7-4b69-95fa-505ab13f8116",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 5
      },
      {
        "id": "b6aa41f0-29d9-4351-a196-0ed10166206b",
        "muscleId": "8c8f8332-19c3-4e83-8f8e-6d681e2ddc33",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "ed3ccaa5-46b0-496d-894f-292dd987dbb0",
    "name": "Crucifixo inverso com halteres",
    "aliases": [
      {
        "id": "79f21fe7-fea0-4ea0-853c-ba739f49b5f7",
        "alias": "Elevação posterior"
      },
      {
        "id": "a4069c10-5b72-413e-ac57-a40e337e84ba",
        "alias": "Reverse fly"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "127b7599-e107-4202-87fb-a61bae8ab15a",
        "muscleId": "82d98d85-015c-453e-9af2-a9953b68114f",
        "recruitment": 5
      },
      {
        "id": "1fd31ba0-a4a0-424d-b318-0dc5dca6bcc7",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 3
      },
      {
        "id": "5cd60f9d-7c22-483a-a08f-d1f99e0dcdac",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 3
      },
      {
        "id": "b5a5c51a-776f-4ea8-bff6-a975f68805b5",
        "muscleId": "df609386-4f4c-4223-a935-1d32e440a5ed",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "2a5b6e61-5d04-4a31-af1c-c806b0f1c165",
    "name": "Crucifixo inverso na máquina",
    "aliases": [
      {
        "id": "6c275860-da10-4e59-a90f-a65471ecd941",
        "alias": "Peck deck inverso"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "92223ed5-4059-4137-8321-488cf6c71514",
        "muscleId": "82d98d85-015c-453e-9af2-a9953b68114f",
        "recruitment": 5
      },
      {
        "id": "ab47cce6-4121-4a37-b4a7-15355e43051f",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 3
      },
      {
        "id": "99ea6214-d53f-453c-9891-168d36a72cfd",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "d5801e27-a409-469e-97f1-6b05136154d8",
    "name": "Crucifixo inverso no cabo",
    "aliases": [
      {
        "id": "48edd552-4115-41cd-b270-305370669d95",
        "alias": "Elevação posterior no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "09173f8c-fbc1-48fd-bb59-51261f6007c7",
        "muscleId": "82d98d85-015c-453e-9af2-a9953b68114f",
        "recruitment": 5
      },
      {
        "id": "5924c416-fe84-49b8-8317-e87d4246fb21",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 3
      },
      {
        "id": "66fd0e51-538a-41d5-9369-4b6e849bdb39",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "138485a7-749e-46f2-a3f4-546b2f2d3b44",
    "name": "Puxada para o rosto",
    "aliases": [
      {
        "id": "c207e109-3698-4187-b7af-031dd03317f7",
        "alias": "Face pull"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "8a933d6b-b557-4448-9af3-fe488e5c21c7",
        "muscleId": "82d98d85-015c-453e-9af2-a9953b68114f",
        "recruitment": 5
      },
      {
        "id": "6ca0d24f-df68-46aa-88d5-b10cf268abdd",
        "muscleId": "c9693730-31b4-4c14-96f5-33685eb0131b",
        "recruitment": 4
      },
      {
        "id": "b1b9ee80-1f0c-4c7b-92b5-d40ce4c72977",
        "muscleId": "0dddc08f-7422-42ed-8342-50f02c2eb7eb",
        "recruitment": 4
      },
      {
        "id": "98bd2793-57d7-43de-9dfe-3b1037a7de22",
        "muscleId": "df609386-4f4c-4223-a935-1d32e440a5ed",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "98069250-5f09-40be-b878-d73599871060",
    "name": "Remada alta com barra",
    "aliases": [
      {
        "id": "9a118427-d84d-4cc5-9cc0-83281c76fc92",
        "alias": "Remada alta"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "76a2c1d6-753b-41c0-8e7f-b466505f4be0",
        "muscleId": "0f8e95ce-18df-4608-a813-c67eea66ce1f",
        "recruitment": 5
      },
      {
        "id": "4b182514-9551-4272-bd0f-abca4e4e3677",
        "muscleId": "345476b0-bf96-402b-b063-00ff72a8bcbe",
        "recruitment": 4
      },
      {
        "id": "19064678-5ea8-4926-9112-c41f074a28a3",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "84dab69c-9472-4b12-b15c-c5b5b26eb988",
    "name": "Remada alta no cabo",
    "aliases": [
      {
        "id": "aa59357f-bc33-4e5e-89b4-9a35c69dac05",
        "alias": "Remada alta no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "5c6995f1-1d10-4bc1-b7ff-306323b806c1",
        "muscleId": "0f8e95ce-18df-4608-a813-c67eea66ce1f",
        "recruitment": 5
      },
      {
        "id": "0998a430-04d5-4811-8fcb-b2100b740cec",
        "muscleId": "345476b0-bf96-402b-b063-00ff72a8bcbe",
        "recruitment": 4
      },
      {
        "id": "28e95441-e234-4208-9be8-9a6922981dcc",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "04a306f4-b278-40bb-99eb-cda9e3ad2392",
    "name": "Rosca direta com barra",
    "aliases": [
      {
        "id": "8a3558c9-2bf0-4d79-8783-1f555551683b",
        "alias": "Rosca direta"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "1006aa4a-3460-4c01-b78b-47756cada196",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 5
      },
      {
        "id": "2b7a321c-55f5-42bd-bee3-e2440a921296",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "36723565-0b7a-4379-bb66-1a2ea3094864",
    "name": "Rosca direta com barra W",
    "aliases": [
      {
        "id": "1f8993df-50fc-43a8-90b5-9fe46072f4a8",
        "alias": "Rosca W"
      },
      {
        "id": "aaa33281-4785-401f-a6a0-d3be732e8a5b",
        "alias": "Rosca EZ"
      }
    ],
    "equipment": "ez-bar",
    "loadType": "barbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "9d1ff0ce-bfbd-4a31-8ec9-48e6684d35e3",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 5
      },
      {
        "id": "be0ca769-3d03-4e3d-96b4-13a1468f023c",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "a4fff4f9-8995-47f9-87b2-ffa9f049bed2",
    "name": "Rosca direta com halteres",
    "aliases": [
      {
        "id": "e5c20632-2e8a-42e9-a872-05f4523fd492",
        "alias": "Rosca com halteres"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "eb5aeea2-8880-4b18-8fcb-43e1d74d00af",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 5
      },
      {
        "id": "a6f1b4d1-f6ac-47e6-8b6f-a14118cc9c32",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "b6d15bf7-5567-4d48-9fe9-f56d681c0454",
    "name": "Rosca alternada com halteres",
    "aliases": [
      {
        "id": "0c4c731f-f671-46b5-a83d-ef4e1ceeb297",
        "alias": "Rosca alternada"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "80f82e9d-ecea-4771-9454-2ec37f2ad297",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 5
      },
      {
        "id": "232ca942-78ed-45eb-8378-a4e5530819e2",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "ab82fd83-d096-47ff-8e91-c8b01da2510d",
    "name": "Rosca martelo",
    "aliases": [
      {
        "id": "61873a27-c9e3-49da-a276-88701b2dd2b7",
        "alias": "Martelo"
      },
      {
        "id": "80eea609-e9e5-43ff-8107-11402c2707aa",
        "alias": "Rosca hammer"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "83ab9b1e-03a2-4252-91ce-8b3f53da5256",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 5
      },
      {
        "id": "e8589384-e332-41ff-8d01-6ca9f9f9ff4b",
        "muscleId": "f4798475-3c7b-4637-95bd-5767e14ac27f",
        "recruitment": 4
      },
      {
        "id": "63d68281-5738-42eb-b755-2f53708551e1",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "c4a3d065-7daf-40a2-9520-3c09a55d72f4",
    "name": "Rosca martelo no cabo",
    "aliases": [
      {
        "id": "b57e5075-2c9c-430b-8d48-58bdb1e74c9b",
        "alias": "Martelo no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "2227a4c9-8d1b-465e-a4ce-108e4d5ef48f",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 5
      },
      {
        "id": "b4b8c8e5-d8a8-48c1-9c42-00cc3d564dd4",
        "muscleId": "f4798475-3c7b-4637-95bd-5767e14ac27f",
        "recruitment": 4
      },
      {
        "id": "a4d6fbd8-effd-4191-96e3-6c5aac43356f",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "ba22c8ff-e2dd-44ac-aa20-26dbf0e05fc8",
    "name": "Rosca concentrada",
    "aliases": [
      {
        "id": "88b352b1-d7ea-4b9e-ad78-bdf53e4ab7e1",
        "alias": "Rosca concentração"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "a11ca4ba-3043-474e-a6d5-dc7d272eced3",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 5
      },
      {
        "id": "96a53e3a-22a7-46d3-b740-fba634cfb85f",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "40c23012-cb1d-4865-bb64-ecc2a9dd84f8",
    "name": "Rosca scott com barra W",
    "aliases": [
      {
        "id": "4f8228be-1841-4b2d-82d9-2422d58f65f4",
        "alias": "Rosca scott"
      }
    ],
    "equipment": "ez-bar",
    "loadType": "barbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "b129db21-e2ec-46d5-ae24-2c8795f5fb78",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 5
      },
      {
        "id": "72730e6f-5fd7-4ac7-bad0-d00da758c298",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 4
      }
    ]
  },
  {
    "id": "735d3380-ffa9-49f3-a6e2-e4b4200db1ca",
    "name": "Rosca scott na máquina",
    "aliases": [
      {
        "id": "effce332-24c7-43cb-8825-ef3a0b704d08",
        "alias": "Scott máquina"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "c16e4353-6e25-4751-be28-dfc13043a80c",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 5
      },
      {
        "id": "a8106755-e720-4237-86f7-cd8daa3b619f",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "eda47ec7-d04d-45be-b702-8e68a4069bbe",
    "name": "Rosca na polia baixa",
    "aliases": [
      {
        "id": "5f666efe-d919-48d2-a1b8-294c15b7264d",
        "alias": "Rosca no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "df01ac15-60f7-4889-8511-04380bb2e58f",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 5
      },
      {
        "id": "882368a7-6c13-4824-93b7-5fcb355c5eb1",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "184a0b02-3f5f-425e-bd2f-8499de755c45",
    "name": "Rosca inclinada com halteres",
    "aliases": [
      {
        "id": "7253a224-94b7-4713-bd6e-fa73c5fe8d3e",
        "alias": "Rosca inclinada"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "8eecd1f0-9254-4f36-90bd-10fc8cf4b277",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 5
      },
      {
        "id": "f120e8b4-c8e7-4a2d-9914-a1dabfabf85a",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "aca21ab2-a7b2-463a-8367-fb901dce7d59",
    "name": "Rosca inversa com barra",
    "aliases": [
      {
        "id": "fcf1e77f-0971-429a-8293-5642b9ae9ede",
        "alias": "Rosca inversa"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "3f105ae8-43f2-4df9-9d96-0b63f04b7263",
        "muscleId": "0f61cdd8-b003-4fd9-86c8-06954c671b52",
        "recruitment": 5
      },
      {
        "id": "fd48bbfc-cd3c-4675-a07e-c17ba59669e9",
        "muscleId": "f4798475-3c7b-4637-95bd-5767e14ac27f",
        "recruitment": 4
      },
      {
        "id": "12848bd7-1606-468b-b68a-09a11c399da6",
        "muscleId": "3fadeb96-6a0a-433f-a590-18167d929d05",
        "recruitment": 2
      },
      {
        "id": "330bfa30-c986-4a63-b253-83485c76d0b0",
        "muscleId": "6295b835-a096-4f8c-81d0-7597e0acea72",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "f9989386-3ac7-40bc-83e9-17212ac6d5ee",
    "name": "Tríceps testa com barra W",
    "aliases": [
      {
        "id": "c3b25e8e-596b-4a2c-b9d7-f40c36a6dd30",
        "alias": "Tríceps testa"
      },
      {
        "id": "3440c412-7ae3-4858-9e53-240681dd1c04",
        "alias": "Skull crusher"
      }
    ],
    "equipment": "ez-bar",
    "loadType": "barbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "3c65e012-582d-497e-ab2c-ae8e76e7c0ee",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 5
      },
      {
        "id": "40eceaa4-8410-4c34-9aee-4ef2acbf0892",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 4
      },
      {
        "id": "a6427420-3971-4c6d-a86a-fbab19a279ac",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "8dc36ad7-870d-4c3f-b447-9d1cfe3135e7",
    "name": "Tríceps testa com halteres",
    "aliases": [
      {
        "id": "2d5665a0-46a9-4b9e-8a49-0d0f9c4920f6",
        "alias": "Testa com halter"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "9af5e585-3808-4ae0-9336-05aeca98e39c",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 5
      },
      {
        "id": "71656a01-ef97-4547-819f-af3850d5cbfd",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "14c6900b-936f-40d5-a13d-bdc58974c73c",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "d3ca519c-313e-45fc-babf-6818c03d15b6",
    "name": "Tríceps na polia com barra",
    "aliases": [
      {
        "id": "db69f292-6247-4d50-be1e-fd2bab32a3ba",
        "alias": "Tríceps pulley"
      },
      {
        "id": "acc518bc-461b-453b-8304-44c7e1e01899",
        "alias": "Pushdown"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "3849f2fb-dd54-4ef8-a0fc-b454a1716753",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 5
      },
      {
        "id": "68f9174f-19e6-460e-a0dc-49772dfb5549",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 4
      },
      {
        "id": "abe25add-cd3e-4099-b4af-8be395c2bb34",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "218fee1c-0a77-4c33-9c13-8a675556bf91",
    "name": "Tríceps na polia com corda",
    "aliases": [
      {
        "id": "47a5324e-8ecb-4249-9a02-8c8451c51bf7",
        "alias": "Tríceps corda"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "af02e5c8-0bc5-462e-8c0a-4ede7ffef658",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 5
      },
      {
        "id": "5b3c58aa-77b3-4564-8010-7b6e2920a07d",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 4
      },
      {
        "id": "ef204c15-af5d-4694-8961-f6911093f593",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 4
      }
    ]
  },
  {
    "id": "59c4aab5-fe9b-4b9b-9000-4bf07b1b007e",
    "name": "Tríceps francês com halter",
    "aliases": [
      {
        "id": "8428f70d-7bac-472a-81e4-b9002b9a973f",
        "alias": "Tríceps francês"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "356df442-8a23-46d8-9114-faf8fceb7bfc",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 5
      },
      {
        "id": "cf453849-540d-4a83-9300-136baa48596c",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "4c1a20f5-5dea-4434-876a-73606d76ccfe",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "14b24cce-bbde-46de-9e73-c157640e4bef",
    "name": "Tríceps francês no cabo",
    "aliases": [
      {
        "id": "7e32951a-43fa-480d-b0f5-7c334aa80ddd",
        "alias": "Francês no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "7303198c-8471-4c4c-aba3-c301dc8cc392",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 5
      },
      {
        "id": "76a4ea27-3e5d-4cc2-8f74-b463ae4b4d32",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 3
      },
      {
        "id": "d98035d9-7624-4d94-8793-d4abc339be14",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "693c3d01-8430-4b3e-bfd4-eaafda362582",
    "name": "Tríceps coice com halter",
    "aliases": [
      {
        "id": "db0de2e1-2519-46fc-a7ec-ac6a856da777",
        "alias": "Coice"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "isolation",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "6c5fd7b9-a3f8-4c00-89c6-5057fcd06ff8",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 5
      },
      {
        "id": "ac0e6eb1-7e4d-417a-acf5-d5826ef1892f",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 4
      },
      {
        "id": "7840a43f-d3bc-4cc7-a7a1-a8b7bc001da1",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "8c3921ab-8476-4fbb-8776-63a45f643b83",
    "name": "Tríceps coice no cabo",
    "aliases": [
      {
        "id": "27bb4f51-33cb-47be-87f5-faec468ae1de",
        "alias": "Coice no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "c3c11e93-c504-45b1-a6e4-0c0fdf72b760",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 5
      },
      {
        "id": "6174c23c-e3f0-48be-a665-c61b842bb7da",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 4
      },
      {
        "id": "439a609a-fe75-4c7c-9f1f-72d387f2a0d8",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "d4918d5d-9952-4eb4-9ab5-792755f192b4",
    "name": "Mergulho no banco",
    "aliases": [
      {
        "id": "5a9d4ad6-c798-4c2a-840f-1c7890010be7",
        "alias": "Tríceps banco"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "8f0db452-43fd-42e4-a293-4ec3a953bcc1",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 5
      },
      {
        "id": "c86bbd3c-dd00-4cb4-8244-1f224ce4ae38",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 4
      },
      {
        "id": "380814c9-1311-4d1d-8591-20bc2dc7ae97",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 3
      },
      {
        "id": "4bf21ed5-0664-430c-9397-512401d7716a",
        "muscleId": "dd3c79b8-6f2e-48bf-898a-0934f4d5f934",
        "recruitment": 2
      },
      {
        "id": "02dbbec4-b990-44a6-91ff-8d43e8543c3a",
        "muscleId": "2fa1e4d3-83d2-48bd-9866-6a60f87f4d4a",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "e8f78e94-ec10-4512-9204-6799b82cee3d",
    "name": "Tríceps na máquina",
    "aliases": [
      {
        "id": "85bcc126-8faa-4770-946b-2a8213d33789",
        "alias": "Tríceps articulado"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "f1babb5d-fd64-4a0c-b107-19aae6591330",
        "muscleId": "bfc318d8-3ba4-4cd2-9b97-0c6e7ce0f263",
        "recruitment": 5
      },
      {
        "id": "5c7ded39-8952-4996-a51a-919d75ed28f6",
        "muscleId": "300223ec-9001-4f15-9544-896d7d064ad1",
        "recruitment": 4
      },
      {
        "id": "7c2da7f0-6ba5-4954-9cec-c62d582b4b25",
        "muscleId": "ab596529-7b56-467c-aa88-e02b7eeff0dc",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "4640279b-32ac-4a67-bb89-611e035eb02a",
    "name": "Rosca de punho com barra",
    "aliases": [
      {
        "id": "adc91596-7bcd-46b6-bf9a-4b6c09bc2e87",
        "alias": "Flexão de punho"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "54a1ebcd-ece8-4057-9bd7-3491d6686e5d",
        "muscleId": "f741fdb9-62ac-40d2-996d-c6951cf1d780",
        "recruitment": 5
      }
    ]
  },
  {
    "id": "8cad4721-0cb0-4ac2-9aa8-125be466aef6",
    "name": "Rosca de punho inversa com barra",
    "aliases": [
      {
        "id": "9e03217f-a194-4970-9330-6331cf431fef",
        "alias": "Extensão de punho"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "899f9f3a-52de-49eb-9721-1cf62eedbcf9",
        "muscleId": "6295b835-a096-4f8c-81d0-7597e0acea72",
        "recruitment": 5
      }
    ]
  },
  {
    "id": "d27f9bf4-ef79-437a-91b0-11a127d3555d",
    "name": "Agachamento livre",
    "aliases": [
      {
        "id": "3d6797df-d0dd-4ef9-beb7-7f3cb7f3d64e",
        "alias": "Agachamento com barra"
      },
      {
        "id": "e7b8af5f-cd7f-433b-9e2a-1044ebdcd2cd",
        "alias": "Back squat"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "cf4522e6-991f-45bb-9d83-b5a83527d0c4",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 5
      },
      {
        "id": "8aeb370c-797e-4034-97b7-b52253d74cd1",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 4
      },
      {
        "id": "0d3b2aa2-2a9e-4c1c-af6c-acebf61afa6b",
        "muscleId": "cdc2a622-6050-4f05-a58d-e65680e25010",
        "recruitment": 3
      },
      {
        "id": "28c2a91f-e77a-483b-a383-3dabbaddbc8c",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 3
      },
      {
        "id": "b5738d9e-f3fc-40bc-8e4f-347457935bb5",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 2
      },
      {
        "id": "ea2a8ad2-0362-4ddb-89fd-6e933fa980cf",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "613abd4e-24d2-4db2-8f02-b6e5ed53c80a",
    "name": "Agachamento frontal",
    "aliases": [
      {
        "id": "84613152-29e6-41b5-a547-2f13d52ca81f",
        "alias": "Agachamento frontal com barra"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "d6e1429a-3949-4bcb-8e6b-31d72dc775c2",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 5
      },
      {
        "id": "296f3d45-ed8c-42bc-b1e5-de659c4f38e7",
        "muscleId": "cdc2a622-6050-4f05-a58d-e65680e25010",
        "recruitment": 4
      },
      {
        "id": "c469ff06-ce23-4d2b-a5f1-a998c5fc1893",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 3
      },
      {
        "id": "e35cd93c-fca3-4956-89d9-3263b526c037",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "abc1dbdd-da63-45c7-a78a-8586236ea474",
    "name": "Agachamento no hack",
    "aliases": [
      {
        "id": "283ad1c5-de9a-48c7-9488-a023af504318",
        "alias": "Hack"
      },
      {
        "id": "5de50b14-3636-4cbe-96d8-85b770824ad6",
        "alias": "Hack squat"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "a79ac4db-6453-4169-a5fe-a38c94542074",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 5
      },
      {
        "id": "130b91b9-048f-4b4a-9413-00308305e94b",
        "muscleId": "cdc2a622-6050-4f05-a58d-e65680e25010",
        "recruitment": 4
      },
      {
        "id": "ce8a1673-a239-4b05-a24f-a91871f028b4",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "c90aeb70-32e7-482f-bb50-18e55892ac81",
    "name": "Agachamento no Smith",
    "aliases": [
      {
        "id": "7e2ae825-c05d-43c8-acf2-b03cebefb397",
        "alias": "Smith squat"
      }
    ],
    "equipment": "smith",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "d44f293e-26ea-4648-aee3-07d3538f1792",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 5
      },
      {
        "id": "53982a98-9aad-4e5b-862c-a383b7be2fe2",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 4
      },
      {
        "id": "60958b5b-0e68-4e58-b056-ad38c4eff0d2",
        "muscleId": "cdc2a622-6050-4f05-a58d-e65680e25010",
        "recruitment": 3
      },
      {
        "id": "a0238d2f-1814-4cef-85e3-76b52ea11c21",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "c847a2fa-8b18-4931-b4e7-e4345379a1fa",
    "name": "Leg press 45°",
    "aliases": [
      {
        "id": "d9bddebe-5f9b-4924-aa37-5cda3ee3c0f4",
        "alias": "Leg press"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "12f57c3e-d2bc-46b8-8405-c40153ea7399",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 5
      },
      {
        "id": "947e311b-c1bd-4d56-a4e7-27bdb49a0d4e",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 4
      },
      {
        "id": "a99e5ae6-233e-402c-a3f9-7595314a5f07",
        "muscleId": "cdc2a622-6050-4f05-a58d-e65680e25010",
        "recruitment": 3
      },
      {
        "id": "ffa0891b-8d1b-44e7-9d04-b23d2105e7ad",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 2
      },
      {
        "id": "c4283455-594f-43eb-add4-9b259f63667a",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "265b20f2-df97-4db1-b095-a5d449beff60",
    "name": "Agachamento búlgaro",
    "aliases": [
      {
        "id": "2fa5d7ce-649e-409d-a754-31b5b3dcdb7f",
        "alias": "Búlgaro"
      },
      {
        "id": "966fb7cf-80a2-4a03-97af-44aee774f2f9",
        "alias": "Afundo búlgaro"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "compound",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "310d1332-e647-4558-bac6-aaff84b36f5d",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 5
      },
      {
        "id": "835aa622-92f4-4e8b-9751-f03ae368ca4d",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 4
      },
      {
        "id": "90334b61-cfe3-4319-9892-7d3397df3a34",
        "muscleId": "cdc2a622-6050-4f05-a58d-e65680e25010",
        "recruitment": 3
      },
      {
        "id": "613211d8-5ec6-4dd9-883c-95c976ae4bc0",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "4f4646d4-225d-4497-ba82-001323c8f053",
    "name": "Afundo com halteres",
    "aliases": [
      {
        "id": "8a800bd9-d38d-4271-97e6-1de1f4088489",
        "alias": "Avanço"
      },
      {
        "id": "4df0c63d-c729-4cdd-b506-7757860d1dd7",
        "alias": "Passada"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "compound",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "df0e783d-be99-40ce-b871-3a9725b3ab27",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 5
      },
      {
        "id": "06fdf013-c441-4846-9c52-3b9f4341255d",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 4
      },
      {
        "id": "dade563f-802e-4033-a54b-03a5fb1920f5",
        "muscleId": "cdc2a622-6050-4f05-a58d-e65680e25010",
        "recruitment": 3
      },
      {
        "id": "e98801ce-29de-46a4-b58e-ecda9eda940c",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "fc44df71-9fcf-4a96-a797-41f927124d4e",
    "name": "Agachamento taça",
    "aliases": [
      {
        "id": "814421b6-63d9-4865-a33c-0827ff5fc672",
        "alias": "Goblet squat"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "e9a85866-4f95-409a-8c1f-d3cb23fdab14",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 5
      },
      {
        "id": "066a4ee7-8502-4503-85cb-d706f04edb78",
        "muscleId": "cdc2a622-6050-4f05-a58d-e65680e25010",
        "recruitment": 4
      },
      {
        "id": "5fd219e9-3c9b-40d1-a47a-154ea6cdf23e",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "613f8ee8-c781-47c6-a998-c8ebc754ea34",
    "name": "Cadeira extensora",
    "aliases": [
      {
        "id": "02084cf9-6c26-499b-8476-d68f0976d4d5",
        "alias": "Extensora"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "7b646f56-a6f2-45a8-8bae-e453426802d4",
        "muscleId": "cdc2a622-6050-4f05-a58d-e65680e25010",
        "recruitment": 5
      },
      {
        "id": "8e2b0020-d5d4-463e-bb5a-9fad32ceeea1",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 4
      }
    ]
  },
  {
    "id": "833b865a-a323-43c3-a422-24e624347c6a",
    "name": "Agachamento sumô com halter",
    "aliases": [
      {
        "id": "a78cba6b-2402-4045-a89c-903aba08a6cd",
        "alias": "Sumô com halter"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "2a3ae3b8-d2a5-4c8e-9294-61e19f973fe5",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 5
      },
      {
        "id": "b37362cd-20e1-497d-86d6-711dd29f6c3a",
        "muscleId": "335b2641-71dc-410b-aa38-fce7f7347479",
        "recruitment": 4
      },
      {
        "id": "0826c89f-e6c8-429c-b7c6-2431e85628a2",
        "muscleId": "810a947d-d094-4d3b-8f18-aa653ea82f24",
        "recruitment": 4
      },
      {
        "id": "f69ab4c2-cc42-4b09-834f-e3a42c385886",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "7b9ecc92-3247-4918-9eda-2588f23005ce",
    "name": "Levantamento terra romeno",
    "aliases": [
      {
        "id": "53e2cf31-6fa3-4b14-aeb0-6b9a5a4d47ae",
        "alias": "RDL"
      },
      {
        "id": "e49598c6-94bc-4ca3-aaa3-defde57c4a64",
        "alias": "Terra romeno"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "8deb11ba-55f7-43ca-af4a-b7814d87c2f1",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 5
      },
      {
        "id": "3b0ab7b6-7400-4bd4-97be-525849ad56b2",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 4
      },
      {
        "id": "d4a2c7ef-675f-4749-a51c-d0803c2d863c",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 4
      },
      {
        "id": "e372cf63-59a8-4f0f-86c1-36f503165cdc",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "26bad594-2873-4b7c-8af6-d7fbe500cb38",
    "name": "Stiff com barra",
    "aliases": [
      {
        "id": "8d1171c2-94df-40f3-a608-f6b448d8ce16",
        "alias": "Stiff"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "38463816-ad9c-45f5-9554-fe81aadd2757",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 5
      },
      {
        "id": "11ab718f-a9f2-4d39-a442-f2a7c637becc",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 5
      },
      {
        "id": "17db6fb2-31ce-415d-895a-c5e9fba0b9ba",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 3
      },
      {
        "id": "2ea8894e-1a25-41b5-82d3-b8173ced8d15",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "1925c714-2ba1-4e3a-bd4a-29c675857e0b",
    "name": "Stiff com halteres",
    "aliases": [
      {
        "id": "30f21177-ea34-468d-a4a8-d51c5065e111",
        "alias": "Stiff com halter"
      }
    ],
    "equipment": "dumbbell",
    "loadType": "dumbbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "0ce4a900-bb94-4cfe-a853-8437aa3b1b62",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 5
      },
      {
        "id": "6162ce08-422f-4d34-a8c9-791c84b88059",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 5
      },
      {
        "id": "e72b0de8-bde0-4bcf-98b5-9f11f07d74e3",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 3
      },
      {
        "id": "8b760d78-26b8-4989-8687-1188947be455",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "4bb2bfac-4b99-4540-86fe-d1c8a6603187",
    "name": "Mesa flexora",
    "aliases": [
      {
        "id": "f16d012a-f2f5-4d57-9587-0bf39204a25e",
        "alias": "Flexora deitada"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "944095b9-cffd-47c1-a1c4-72979c65f18e",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 5
      },
      {
        "id": "f24dc521-2d9f-434a-a2fd-56bd926a3ddc",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 4
      },
      {
        "id": "f776a333-e32b-4f14-a703-07e87239aefd",
        "muscleId": "03f6df50-200f-400d-adfc-d6ac134fe785",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "973eea80-214d-4904-9458-34d5b464045b",
    "name": "Cadeira flexora",
    "aliases": [
      {
        "id": "22b233c6-d3fa-49ed-89c7-8e763cb9bd01",
        "alias": "Flexora sentada"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "33d8c075-b826-4c19-96f9-ad58a40b0372",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 5
      },
      {
        "id": "835a3ce8-f022-4861-91ef-acdb336de90c",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 4
      }
    ]
  },
  {
    "id": "1a2d53be-a239-4c8e-b8fd-5bc6c0caabf4",
    "name": "Flexora em pé",
    "aliases": [
      {
        "id": "c74fe8b6-76a0-4bd3-aa27-092d02cd11ed",
        "alias": "Flexora unilateral"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "81712dce-e50d-49a5-875a-a519ab9faee8",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 5
      },
      {
        "id": "759e01b7-e4c6-4f30-9c83-386e282bd6bb",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 4
      }
    ]
  },
  {
    "id": "df71966c-9a77-42de-96f0-19b07d658920",
    "name": "Bom dia",
    "aliases": [
      {
        "id": "b38bee23-7abb-4588-84c7-3f345b77f4c6",
        "alias": "Good morning"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "compound",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "0073efa4-012c-46a5-b93c-452319758708",
        "muscleId": "c64db953-6ebc-424d-8184-6eac22cc4f69",
        "recruitment": 5
      },
      {
        "id": "9e999fd3-c444-4f79-be30-fee71b7f890a",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 4
      },
      {
        "id": "104c7991-fbaf-47e4-8036-8abd4aecef15",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 4
      },
      {
        "id": "a83d85b9-9f25-4142-9b15-2b05d6e7a3ec",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 4
      }
    ]
  },
  {
    "id": "d01b80a3-39da-4cc0-95d8-77abc387fe82",
    "name": "Elevação pélvica com barra",
    "aliases": [
      {
        "id": "d05a824b-f068-4d13-9962-b3b6f2c0a9d1",
        "alias": "Hip thrust"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "b1c810db-4de7-4cae-8a63-10efb495a78d",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 5
      },
      {
        "id": "bee123bf-e12a-4ad1-988d-5fb82a1e8fa8",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 3
      },
      {
        "id": "7ff8d933-9298-4397-b876-23ab6526774d",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "e67ce5c5-042d-47a4-9b0c-b11cd6f07e82",
    "name": "Elevação pélvica na máquina",
    "aliases": [
      {
        "id": "060f6822-bfa2-4553-870b-90040693aa4d",
        "alias": "Hip thrust na máquina"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "1ffc6b52-e860-4258-9e9c-9026cb6fe713",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 5
      },
      {
        "id": "b0906897-309e-4352-9ca4-1ac2ab693053",
        "muscleId": "4ea8b6e9-db1c-43b9-8534-7234bc4cd7c7",
        "recruitment": 3
      },
      {
        "id": "21aba994-e9bc-45d5-be53-1c91c54241ac",
        "muscleId": "15b540af-7d05-403d-b7f7-392b2d85d6d1",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "c5bef9ca-3ba9-4576-8a1c-3950db91d1c0",
    "name": "Coice no cabo",
    "aliases": [
      {
        "id": "444d230e-9337-4878-bfb5-aa5ef69d2978",
        "alias": "Glúteo no cabo"
      },
      {
        "id": "51e43d9a-61f9-410c-b59f-85234393d72d",
        "alias": "Kickback"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "127f7d1c-741a-48d0-9e95-981b74b30de4",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 5
      }
    ]
  },
  {
    "id": "1d4455fb-9b66-4a78-8e10-88e75363f04d",
    "name": "Abdução de quadril na máquina",
    "aliases": [
      {
        "id": "a5f0b02d-14c2-4f40-b29c-56cbc1624d23",
        "alias": "Cadeira abdutora"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "e937966d-00de-4dd6-be0a-e823bf754265",
        "muscleId": "700180ab-ded3-424a-9c8a-be84e26e5800",
        "recruitment": 5
      },
      {
        "id": "2527e24c-b949-4f39-9b9b-dc0b02cd316d",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "e09d8818-c401-4c32-82cd-88d60ec28582",
    "name": "Abdução de quadril no cabo",
    "aliases": [
      {
        "id": "89bcb2c1-db40-43e7-919b-fb83a8844e0c",
        "alias": "Abdução no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "20259b4d-57af-4c6a-8223-e8cb25f10a41",
        "muscleId": "700180ab-ded3-424a-9c8a-be84e26e5800",
        "recruitment": 5
      },
      {
        "id": "61926650-8b49-466a-9864-53835c106e87",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "8a71d915-69d8-46fe-b88f-77864c47ede9",
    "name": "Ponte de glúteo",
    "aliases": [
      {
        "id": "271c00c1-b859-49f2-919c-a2f58997e1c5",
        "alias": "Ponte"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "e9ef155d-24c9-4b1a-8a79-04ba07672b42",
        "muscleId": "fc422486-f39e-4b48-a48c-f240e2da670b",
        "recruitment": 5
      }
    ]
  },
  {
    "id": "a2270eea-9b0a-42e3-9371-457c284f8c38",
    "name": "Adução de quadril na máquina",
    "aliases": [
      {
        "id": "1d297ea2-2584-467a-9d57-a4282588a637",
        "alias": "Cadeira adutora"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "847a2e6b-8964-4eb8-889e-032a0aca2215",
        "muscleId": "335b2641-71dc-410b-aa38-fce7f7347479",
        "recruitment": 5
      }
    ]
  },
  {
    "id": "75a57787-1f28-45e0-8c27-eae807c960ca",
    "name": "Panturrilha em pé na máquina",
    "aliases": [
      {
        "id": "0810fc88-b596-4cb6-a36a-532fd3779014",
        "alias": "Panturrilha em pé"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "518d474a-5f46-4792-b130-4448f2d16305",
        "muscleId": "03f6df50-200f-400d-adfc-d6ac134fe785",
        "recruitment": 5
      },
      {
        "id": "0459ddaa-7b60-46e2-9dd7-4446de4d3401",
        "muscleId": "614c3ac9-02f5-40d3-9480-d52fc676b462",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "b55b01ec-3e3b-45cd-b4ad-0cea65f830d0",
    "name": "Panturrilha sentada",
    "aliases": [
      {
        "id": "cff316d2-198f-4f77-b4f6-30c821442bac",
        "alias": "Panturrilha sentado"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "a4322095-043d-44b5-afd7-f0a43fd98dd4",
        "muscleId": "614c3ac9-02f5-40d3-9480-d52fc676b462",
        "recruitment": 5
      },
      {
        "id": "0bcbf40e-8fe3-4053-8d9f-9f5e697905f7",
        "muscleId": "03f6df50-200f-400d-adfc-d6ac134fe785",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "25d3e278-425e-4725-9ffc-79f64774b048",
    "name": "Panturrilha no leg press",
    "aliases": [
      {
        "id": "1d0ae07e-aa12-4524-bbc5-7c9e55077e4c",
        "alias": "Panturrilha no press"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "f26c4a67-9857-4b13-aa6c-af253b887424",
        "muscleId": "03f6df50-200f-400d-adfc-d6ac134fe785",
        "recruitment": 5
      },
      {
        "id": "35fb3e3f-b5ec-4059-a2a0-c846fd38d288",
        "muscleId": "614c3ac9-02f5-40d3-9480-d52fc676b462",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "f65371a6-b058-4d66-ad2e-cf0a2790a1f9",
    "name": "Panturrilha em pé com barra",
    "aliases": [
      {
        "id": "8118ef3b-3abb-485d-8d3a-e293423cb1e1",
        "alias": "Panturrilha livre"
      }
    ],
    "equipment": "barbell",
    "loadType": "barbell",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "54d5ef8e-099d-46bc-9682-35b949e36daa",
        "muscleId": "03f6df50-200f-400d-adfc-d6ac134fe785",
        "recruitment": 5
      },
      {
        "id": "41015332-c98e-4ec4-8cc7-1b612a6a5399",
        "muscleId": "614c3ac9-02f5-40d3-9480-d52fc676b462",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "9c1d7adf-f8ab-478e-8e06-eef150bd07e3",
    "name": "Panturrilha unilateral no degrau",
    "aliases": [
      {
        "id": "07ec21ba-1902-4955-8808-059fa088cb2a",
        "alias": "Panturrilha unilateral"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "isolation",
    "unilateral": true,
    "ownerId": null,
    "recruitment": [
      {
        "id": "5b250332-0e61-49d9-92e6-7046718d86ae",
        "muscleId": "03f6df50-200f-400d-adfc-d6ac134fe785",
        "recruitment": 5
      },
      {
        "id": "6458cd72-76a4-4d34-9c33-020a4e51a101",
        "muscleId": "614c3ac9-02f5-40d3-9480-d52fc676b462",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "d62d2d7c-3695-470c-967a-2c95ecbd5fa4",
    "name": "Abdominal supra",
    "aliases": [
      {
        "id": "c41e5e59-9beb-40f9-9ab6-8966ffc52efe",
        "alias": "Crunch"
      },
      {
        "id": "4b524b37-e0ff-410e-ab57-4f19ef5c461a",
        "alias": "Abdominal curto"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "bdf97eb8-d0b3-411c-9407-140c3f7519c2",
        "muscleId": "1d65abf4-d7b6-4147-aafd-d80083a04819",
        "recruitment": 5
      }
    ]
  },
  {
    "id": "e31a6f5e-5d79-498e-abbb-acae6877c88b",
    "name": "Abdominal na máquina",
    "aliases": [
      {
        "id": "003f8175-a96c-4f7d-805c-c99fb9e4ea0e",
        "alias": "Crunch na máquina"
      }
    ],
    "equipment": "machine",
    "loadType": "machine",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "339d36e2-5930-4187-9cf2-c79af1572c31",
        "muscleId": "1d65abf4-d7b6-4147-aafd-d80083a04819",
        "recruitment": 5
      }
    ]
  },
  {
    "id": "61cd5af1-3b2b-4be2-8183-d9603be7b04e",
    "name": "Abdominal no cabo",
    "aliases": [
      {
        "id": "fdca5f0f-fbd6-4ed5-85e3-0c0c0c3853c0",
        "alias": "Crunch no cabo"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "27585096-264c-4d2a-93b9-b761ed727f03",
        "muscleId": "1d65abf4-d7b6-4147-aafd-d80083a04819",
        "recruitment": 5
      }
    ]
  },
  {
    "id": "525cdb1f-d122-4d6b-993a-dc340aa8888b",
    "name": "Abdominal infra",
    "aliases": [
      {
        "id": "3a63f169-ea12-4916-aff1-fdd0f2c23b4f",
        "alias": "Elevação de pernas deitado"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "a891fbd8-2aab-49b4-b986-974a3fda30b6",
        "muscleId": "1d65abf4-d7b6-4147-aafd-d80083a04819",
        "recruitment": 5
      }
    ]
  },
  {
    "id": "b70f40fb-e99a-41dc-999f-c55c3c4a663d",
    "name": "Elevação de pernas suspenso",
    "aliases": [
      {
        "id": "f9807951-7e87-4e8d-a15b-c73d0efbb3c4",
        "alias": "Elevação de joelhos na barra"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "38ede49b-e06a-4e8c-be06-24acecc3b25c",
        "muscleId": "1d65abf4-d7b6-4147-aafd-d80083a04819",
        "recruitment": 5
      },
      {
        "id": "c2fa763c-1007-4c30-9603-15fba7eb87f5",
        "muscleId": "29491282-8d42-4cce-b007-0b4df0891bd7",
        "recruitment": 2
      }
    ]
  },
  {
    "id": "4e17bae7-2d9e-44bf-aa01-23b3aee9c812",
    "name": "Prancha",
    "aliases": [
      {
        "id": "3fe4b605-1d4f-42a1-a059-d8a0acae183a",
        "alias": "Prancha isométrica"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "54d6201f-a9b2-4ffc-bc89-32ad8bed15ab",
        "muscleId": "1d65abf4-d7b6-4147-aafd-d80083a04819",
        "recruitment": 5
      },
      {
        "id": "83e90a57-02cd-4163-8aa0-ccb075955cb6",
        "muscleId": "29491282-8d42-4cce-b007-0b4df0891bd7",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "a6f4da52-1193-4502-ba36-a07361ab1d66",
    "name": "Rotação no cabo",
    "aliases": [
      {
        "id": "f66fabfd-cc15-4034-a3b2-d51916137b8d",
        "alias": "Oblíquo no cabo"
      },
      {
        "id": "6e877219-8af8-4e94-a71c-fcb193cd1197",
        "alias": "Woodchop"
      }
    ],
    "equipment": "cable",
    "loadType": "cable",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "e4b40733-7792-4dd8-9d1c-31db6c7562ae",
        "muscleId": "29491282-8d42-4cce-b007-0b4df0891bd7",
        "recruitment": 5
      },
      {
        "id": "5b2ced62-d629-4a0c-b16d-bcad298191f7",
        "muscleId": "1d65abf4-d7b6-4147-aafd-d80083a04819",
        "recruitment": 3
      }
    ]
  },
  {
    "id": "a4bc1785-4f99-42b0-b636-c7cdfceed5d7",
    "name": "Abdominal oblíquo",
    "aliases": [
      {
        "id": "32a5446d-58c3-4ee4-bc33-39311d05408e",
        "alias": "Oblíquo bicicleta"
      }
    ],
    "equipment": "bodyweight",
    "loadType": "bodyweight",
    "kind": "isolation",
    "unilateral": false,
    "ownerId": null,
    "recruitment": [
      {
        "id": "882e0cb0-01af-4684-9304-a5dcb22e9442",
        "muscleId": "29491282-8d42-4cce-b007-0b4df0891bd7",
        "recruitment": 5
      },
      {
        "id": "5b1a86d2-e8ba-4d07-977a-2a14d23c1f22",
        "muscleId": "1d65abf4-d7b6-4147-aafd-d80083a04819",
        "recruitment": 3
      }
    ]
  }
];
