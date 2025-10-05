import { neon } from '@neondatabase/serverless';

const createMockSql = () => {
	const mock = async () => {
		return [];
	};
	mock.transaction = async (fn) => fn(mock);
	return mock;
};

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : createMockSql();

export default sql;