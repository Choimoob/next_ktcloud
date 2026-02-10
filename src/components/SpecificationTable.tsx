export function SpecificationTable() {
  const specifications = [
    {
      step: '1. 요청',
      action: '생성 버튼 클릭',
      apiFlow: 'POST /servers',
      exception: '쿼터 부족, 권한 없음',
      auditLog: 'Action: Server_Create\nStatus: Attempt',
      billing: '-',
      billingColor: 'bg-gray-50'
    },
    {
      step: '2. 검증',
      action: '유효성 체크',
      apiFlow: 'Image/Flavor 존재 확인',
      exception: '404 Not Found (Err-01)',
      auditLog: 'Status: Fail\nReason: Image Missing',
      billing: '-',
      billingColor: 'bg-gray-50'
    },
    {
      step: '3. 생성',
      action: '리소스 할당',
      apiFlow: 'Port → Volume → Server',
      exception: 'Nova Error / Timeout',
      auditLog: 'Status: Fail\nReason: Timeout',
      billing: '과금 생성 안 됨 (중요)',
      billingColor: 'bg-red-50'
    },
    {
      step: '4. 완료',
      action: 'Active 전환',
      apiFlow: 'Polling: BUILD → ACTIVE',
      exception: 'Error State 빠짐',
      auditLog: 'Status: Success\nResource_ID: uuid',
      billing: '[START]\n과금 시작 시간 기록\n(created_at)',
      billingColor: 'bg-amber-100'
    },
    {
      step: '5. 운영',
      action: '서버 중지',
      apiFlow: 'POST /action/stop',
      exception: '-',
      auditLog: 'Action: Server_Stop\nStatus: Success',
      billing: '[유지]\n(Stopped 상태도 과금함\n- 정책따라 다름)',
      billingColor: 'bg-amber-50'
    },
    {
      step: '6. 삭제',
      action: '서버 삭제',
      apiFlow: 'DELETE /servers/{id}',
      exception: 'Lock 걸림, 스냅샷 중',
      auditLog: 'Action: Server_Delete\nStatus: Success',
      billing: '[END]\n과금 종료 시간 기록\n(deleted_at)',
      billingColor: 'bg-green-100'
    },
  ];

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">NEXT_Server 리소스 라이프사이클 상세 명세</h2>
      
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
              단계 (Step)
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
              액션 (Action)
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
              API & OpenStack Flow
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
              예외/실패 (Exception)
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
              📝 감사 로그 (Audit Log)
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
              💰 과금 처리 (Billing)
            </th>
          </tr>
        </thead>
        <tbody>
          {specifications.map((spec, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-3 font-semibold bg-blue-50">
                {spec.step}
              </td>
              <td className="border border-gray-300 px-4 py-3">
                {spec.action}
              </td>
              <td className="border border-gray-300 px-4 py-3 font-mono text-xs bg-green-50">
                {spec.apiFlow}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-red-700">
                {spec.exception}
              </td>
              <td className="border border-gray-300 px-4 py-3 bg-sky-50 whitespace-pre-line text-xs">
                {spec.auditLog}
              </td>
              <td className={`border border-gray-300 px-4 py-3 ${spec.billingColor} whitespace-pre-line text-xs font-medium`}>
                {spec.billing}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Policy Points */}
      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-bold">📌 정책적 포인트 (개발자/운영자 회의용)</h3>
        
        <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded">
          <h4 className="font-bold text-amber-900 mb-2">Point 1. 빌링의 시작점 (Billing Trigger)</h4>
          <p className="text-sm text-gray-700">
            <strong>우리는 POST /servers 요청 시점이 아니라, 오픈스택에서 ACTIVE 상태가 확인된 시점을 과금 시작 시간으로 잡는다.</strong>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            → 이걸 명확히 해야 CS를 방지합니다. 다이어그램 표기: ACTIVE 박스 옆에 💰Start 스탬프 찍기.
          </p>
        </div>

        <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
          <h4 className="font-bold text-red-900 mb-2">Point 2. 실패 시 롤백과 로그 (Fail-Safe)</h4>
          <p className="text-sm text-gray-700">
            <strong>서버는 생성이 실패하면 과금 데이터가 아예 생성되면 안 되지만, Audit Log에는 '생성 시도했다가 실패함'이 반드시 남아야 한다.</strong>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            → 다이어그램 표기: 실패(Fail) 경로에는 📝Log: Fail만 있고 💰Bill은 없음.
          </p>
        </div>

        <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
          <h4 className="font-bold text-purple-900 mb-2">Point 3. 삭제 시 "찌꺼기 리소스" 과금</h4>
          <p className="text-sm text-gray-700">
            <strong>서버(DELETE)를 지워도, 사용자가 '볼륨 유지'를 선택하면 서버 과금은 끝나지만(END), 볼륨 과금은 계속(Running) 된다.</strong>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            → 이건 다이어그램에서 서버 삭제 Flow 옆에 별도 주석(Note)으로 크게 써놔야 합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
