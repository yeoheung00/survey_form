import { PrismaClient } from '@/prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});
const prisma = new PrismaClient({ adapter });

interface RequestBody {
    id: string;
    pw: string;
}

export async function POST(request: Request) {
    try{
    const body: RequestBody = await request.json()

    if (!body.id || !body.pw) {
        return new Response(JSON.stringify(
            { message: 'ID와 비밀번호를 모두 입력해야 합니다.', status: 400 }
        ))
    }

    const admin = await prisma.admin.findUnique({
        where: {
            // 입력받은 username 과 테이블 email 컬럼 값이 같은 데이터 추출
            id: body.id,
        },
    })

    if (!admin) {
        return new Response(JSON.stringify({ message: '유효하지 않은 ID입니다.', status: 401 }))
    }

    const isPwValid = await bcrypt.compare(body.pw, admin.pw);

    if(!isPwValid) return new Response(JSON.stringify({message: "아이디 혹은 비밀번호가 일치하지 않습니다.", status: 401}))

    // 패스워드도 동일한지 확인
    return new Response(JSON.stringify({message: '로그인 성공', status: 200}))
    } catch(err){
        return new Response(JSON.stringify({message: '서버오류', status: 500}))
    } 
}