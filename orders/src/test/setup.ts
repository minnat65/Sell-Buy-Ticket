import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var signin: () => string[];
}


// Including file that will be mocked
jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'minnat';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks(); // To erase the record of last mock
  // Get all the collections
  const collectins = await mongoose.connection.db.collections();

  // delete all collections one by one
  for(let collection of collectins) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // const email = "test@test.com";
  // const password = "password";

  // We cannot use this bcz this will create dependency on auth service
  // const response = await request(app)
  //   .post('/api/users/signup')
  //   .send({ email, password })
  //   .expect(201)
  
  // const cookie = response.get('Set-Cookie');

  // return cookie;

  // 1. Build a JWT Payload { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test23@test.in'
  }

  // 2. Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // 3. Build session object { jwt: MY_JWT }
  const session = { jwt : token };

  // 4. turn that object into json
  const sessionJSON = JSON.stringify(session);

  // 5. Take JSON and encode it in base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // 6. return a string, that;s the cookie with encoded data
  return [`session=${base64}`];

}