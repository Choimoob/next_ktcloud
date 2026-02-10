import type { Node, Edge } from '@xyflow/react';

/**
 * NEXT_Server 통합 서비스 흐름도
 * 
 * 🎯 핵심 정책 포인트:
 * 1. ⚡ 빌링 시작점: OpenStack ACTIVE 상태 확인 즉시
 * 2. ↩️ 실패 시 롤백: 생성된 모든 리소스 자동 삭제 + 로그 기록
 * 3. 💰 삭제 시 과금: 보존된 볼륨/네트워크는 별도 과금 계속
 * 
 * 노드 카테고리:
 * - 사용자 액션 (user-action) 🔵
 * - 비즈니스 로직 (business-logic) 🟢
 * - 빌링 로직 (billing-logic) 🟣
 * - 실패/에러 (error) 🔴
 * - 검증/분기 (decision) 🔶
 * - 중요 노트 (note) 🟠
 * - 그룹 영역 (group) ⬜
 */

export const serverCreationFlowData: { nodes: Node[], edges: Edge[] } = {
  nodes: [
    // ========== 그룹 1: 고객 여정 시작 ==========
    {
      id: 'group-1',
      type: 'group',
      position: { x: 50, y: 50 },
      data: { label: '🎯 고객 여정 시작', color: 'lightblue' },
      style: { width: 450, height: 500, zIndex: -1 }
    },

    {
      id: 'n1',
      type: 'process',
      position: { x: 150, y: 120 },
      data: {
        label: '👤 서버 생성 요청',
        section: 'user-action',
        icon: '🚀',
        description: '콘솔/API 호출'
      }
    },

    {
      id: 'n2',
      type: 'process',
      position: { x: 150, y: 240 },
      data: {
        label: '🔐 통합 인증 (MFA)',
        section: 'business-logic',
        icon: '✅',
        description: 'Multi-Factor Auth'
      }
    },

    {
      id: 'd1',
      type: 'decision',
      position: { x: 180, y: 360 },
      data: {
        label: '인증 성공?',
        description: '권한 검증',
        yesLabel: '성공',
        noLabel: '실패'
      }
    },

    {
      id: 'err1',
      type: 'process',
      position: { x: 360, y: 380 },
      data: {
        label: '❌ 접근 거부',
        section: 'error',
        icon: '🚫',
        description: '인증 실패'
      }
    },

    // ========== 그룹 2: 리소스 검증 ==========
    {
      id: 'group-2',
      type: 'group',
      position: { x: 600, y: 50 },
      data: { label: '📋 리소스 검증', color: 'lightgreen' },
      style: { width: 500, height: 700, zIndex: -1 }
    },

    {
      id: 'n3',
      type: 'process',
      position: { x: 700, y: 120 },
      data: {
        label: '📁 프로젝트 확인',
        section: 'business-logic',
        icon: '🔍',
        description: 'OpenStack Project'
      }
    },

    {
      id: 'n4',
      type: 'process',
      position: { x: 700, y: 240 },
      data: {
        label: '🔑 권한 검증',
        section: 'business-logic',
        icon: '🛡️',
        description: 'RBAC 확인'
      }
    },

    {
      id: 'd2',
      type: 'decision',
      position: { x: 730, y: 360 },
      data: {
        label: '쿼터 충분?',
        description: 'CPU/RAM/Disk',
        yesLabel: '충분',
        noLabel: '부족'
      }
    },

    {
      id: 'err2',
      type: 'process',
      position: { x: 920, y: 380 },
      data: {
        label: '❌ 쿼터 부족',
        section: 'error',
        icon: '⚠️',
        description: '리소스 한계'
      }
    },

    {
      id: 'note1',
      type: 'note',
      position: { x: 700, y: 560 },
      data: {
        label: '📝 검증 로그',
        description: '권한/쿼터 확인 기록',
        emoji: '📊'
      }
    },

    // ========== 그룹 3: 네트워크 생성 ==========
    {
      id: 'group-3',
      type: 'group',
      position: { x: 1200, y: 50 },
      data: { label: '🌐 네트워크 구성', color: 'lightcyan' },
      style: { width: 550, height: 900, zIndex: -1 }
    },

    {
      id: 'n5',
      type: 'process',
      position: { x: 1300, y: 120 },
      data: {
        label: '🌐 VPC 생성',
        section: 'business-logic',
        icon: '🔗',
        description: 'Virtual Network'
      }
    },

    {
      id: 'n6',
      type: 'process',
      position: { x: 1300, y: 240 },
      data: {
        label: '🔌 서브넷 설정',
        section: 'business-logic',
        icon: '📡',
        description: 'IP 대역 할당'
      }
    },

    {
      id: 'n7',
      type: 'process',
      position: { x: 1300, y: 360 },
      data: {
        label: '🛡️ 보안그룹 생성',
        section: 'business-logic',
        icon: '🔒',
        description: 'Firewall Rules'
      }
    },

    {
      id: 'd3',
      type: 'decision',
      position: { x: 1330, y: 480 },
      data: {
        label: 'IP 검증',
        description: '중복/설정 확인',
        yesLabel: '정상',
        noLabel: '충돌'
      }
    },

    {
      id: 'err3',
      type: 'process',
      position: { x: 1300, y: 620 },
      data: {
        label: '❌ 네트워크 오류',
        section: 'error',
        icon: '🔥',
        description: 'IP 충돌/설정 실패'
      }
    },

    {
      id: 'rollback1',
      type: 'process',
      position: { x: 1300, y: 740 },
      data: {
        label: '↩️ 네트워크 롤백',
        section: 'business-logic',
        icon: '🔄',
        description: 'VPC/서브넷 삭제'
      }
    },

    {
      id: 'note2',
      type: 'note',
      position: { x: 1500, y: 740 },
      data: {
        label: '⚠️ 롤백 정책 #1',
        description: '실패 시 생성된 모든 네트워크 리소스 자동 삭제',
        emoji: '🔄'
      }
    },

    // ========== 그룹 4: 서버 생성 (핵심) ==========
    {
      id: 'group-4',
      type: 'group',
      position: { x: 1850, y: 50 },
      data: { label: '🖥️ 서버 인스턴스 생성', color: 'lightpurple' },
      style: { width: 700, height: 1200, zIndex: -1 }
    },

    {
      id: 'n8',
      type: 'process',
      position: { x: 1950, y: 120 },
      data: {
        label: '⚙️ Flavor 선택',
        section: 'business-logic',
        icon: '🔧',
        description: 'CPU/RAM 스펙'
      }
    },

    {
      id: 'n9',
      type: 'process',
      position: { x: 1950, y: 240 },
      data: {
        label: '💿 이미지 선택',
        section: 'business-logic',
        icon: '🖼️',
        description: 'OS 이미지'
      }
    },

    {
      id: 'n10',
      type: 'process',
      position: { x: 1950, y: 360 },
      data: {
        label: '💾 볼륨 생성',
        section: 'business-logic',
        icon: '📦',
        description: 'Root Volume'
      }
    },

    {
      id: 'n11',
      type: 'process',
      position: { x: 1950, y: 480 },
      data: {
        label: '🖥️ 서버 생성 API',
        section: 'business-logic',
        icon: '🚀',
        description: 'Nova API 호출'
      }
    },

    {
      id: 'd4',
      type: 'decision',
      position: { x: 1980, y: 600 },
      data: {
        label: 'OpenStack 상태?',
        description: 'ACTIVE 확인',
        yesLabel: 'ACTIVE',
        noLabel: 'ERROR'
      }
    },

    {
      id: 'note-billing-start',
      type: 'note',
      position: { x: 2280, y: 600 },
      data: {
        label: '⚡ 빌링 시작점',
        description: 'OpenStack ACTIVE 상태 확인 시점부터 과금 시작!',
        emoji: '💰'
      }
    },

    {
      id: 'billing-start',
      type: 'process',
      position: { x: 1950, y: 750 },
      data: {
        label: '💰 과금 시작',
        section: 'billing-logic',
        icon: '▶️',
        description: 'ACTIVE 즉시 시작'
      }
    },

    {
      id: 'err4',
      type: 'process',
      position: { x: 1950, y: 900 },
      data: {
        label: '❌ 서버 생성 실패',
        section: 'error',
        icon: '💥',
        description: 'BUILD → ERROR'
      }
    },

    {
      id: 'rollback2',
      type: 'process',
      position: { x: 1950, y: 1020 },
      data: {
        label: '↩️ 전체 롤백',
        section: 'business-logic',
        icon: '🔄',
        description: '볼륨/네트워크/프로젝트 삭제'
      }
    },

    {
      id: 'note3',
      type: 'note',
      position: { x: 2230, y: 1020 },
      data: {
        label: '⚠️ 롤백 정책 #2',
        description: '실패 시 모든 리소스 삭제 + 실패 로그 기록 + 과금 없음',
        emoji: '🔄'
      }
    },

    // ========== 그룹 5: 서버 운영 ==========
    {
      id: 'group-5',
      type: 'group',
      position: { x: 2650, y: 50 },
      data: { label: '⚙️ 정상 운영', color: 'lightgreen' },
      style: { width: 450, height: 650, zIndex: -1 }
    },

    {
      id: 'n12',
      type: 'process',
      position: { x: 2750, y: 120 },
      data: {
        label: '✅ 서버 ACTIVE',
        section: 'business-logic',
        icon: '🟢',
        description: '정상 작동 중'
      }
    },

    {
      id: 'billing-process',
      type: 'process',
      position: { x: 2750, y: 240 },
      data: {
        label: '💰 빌링 처리',
        section: 'billing-logic',
        icon: '💳',
        description: '시간당 과금 누적'
      }
    },

    {
      id: 'n13',
      type: 'process',
      position: { x: 2750, y: 360 },
      data: {
        label: '📊 모니터링',
        section: 'business-logic',
        icon: '👁️',
        description: 'CPU/메모리/네트워크'
      }
    },

    {
      id: 'd5',
      type: 'decision',
      position: { x: 2780, y: 480 },
      data: {
        label: '사용자 액션?',
        description: '서버 제어',
        yesLabel: '삭제',
        noLabel: '계속'
      }
    },

    {
      id: 'note4',
      type: 'note',
      position: { x: 2750, y: 600 },
      data: {
        label: '💡 과금 정책',
        description: 'ACTIVE 상태 유지 시 계속 과금',
        emoji: '⚡'
      }
    },

    // ========== 그룹 6: 서버 삭제 및 최종 정산 ==========
    {
      id: 'group-6',
      type: 'group',
      position: { x: 3200, y: 50 },
      data: { label: '🗑️ 서버 삭제 및 과금 종료', color: 'lightpink' },
      style: { width: 700, height: 1100, zIndex: -1 }
    },

    {
      id: 'user-delete',
      type: 'process',
      position: { x: 3300, y: 120 },
      data: {
        label: '👤 삭제 요청',
        section: 'user-action',
        icon: '🗑️',
        description: '사용자 삭제 명령'
      }
    },

    {
      id: 'n14',
      type: 'process',
      position: { x: 3300, y: 240 },
      data: {
        label: '🖥️ 서버 삭제',
        section: 'business-logic',
        icon: '💥',
        description: 'Instance 삭제'
      }
    },

    {
      id: 'd6',
      type: 'decision',
      position: { x: 3330, y: 360 },
      data: {
        label: '볼륨 삭제?',
        description: '사용자 선택',
        yesLabel: '삭제',
        noLabel: '보존'
      }
    },

    {
      id: 'n15',
      type: 'process',
      position: { x: 3300, y: 500 },
      data: {
        label: '💾 볼륨 삭제',
        section: 'business-logic',
        icon: '🗑️',
        description: 'Data Volume 삭제'
      }
    },

    {
      id: 'volume-keep',
      type: 'process',
      position: { x: 3570, y: 500 },
      data: {
        label: '💾 볼륨 보존',
        section: 'business-logic',
        icon: '📦',
        description: '독립 볼륨 유지'
      }
    },

    {
      id: 'note-orphan-billing',
      type: 'note',
      position: { x: 3570, y: 620 },
      data: {
        label: '💰 찌꺼기 과금',
        description: '보존된 볼륨은 별도 과금 계속됨! (중요)',
        emoji: '⚠️'
      }
    },

    {
      id: 'n16',
      type: 'process',
      position: { x: 3300, y: 650 },
      data: {
        label: '🌐 네트워크 정리',
        section: 'business-logic',
        icon: '🧹',
        description: 'IP 해제/포트 삭제'
      }
    },

    {
      id: 'billing-end',
      type: 'process',
      position: { x: 3300, y: 770 },
      data: {
        label: '💰 과금 종료',
        section: 'billing-logic',
        icon: '⏹️',
        description: '서버 삭제 완료 시점'
      }
    },

    {
      id: 'final-billing',
      type: 'process',
      position: { x: 3300, y: 890 },
      data: {
        label: '💳 최종 정산',
        section: 'billing-logic',
        icon: '🧾',
        description: '사용 시간 * 단가'
      }
    },

    {
      id: 'note5',
      type: 'note',
      position: { x: 3300, y: 1010 },
      data: {
        label: '📝 삭제 로그',
        description: '삭제 시각/사용자/리소스 기록',
        emoji: '📊'
      }
    },

    // ========== 감사 로그 (꼬리표) ==========
    {
      id: 'audit-central',
      type: 'note',
      position: { x: 1200, y: 1100 },
      data: {
        label: '📊 중앙 감사 로그',
        description: '모든 이벤트 중앙 집중 기록',
        emoji: '🗂️'
      }
    },
  ],

  edges: [
    // ========== 메인 플로우 (Happy Path) ==========
    { id: 'e1', source: 'n1', target: 'n2', animated: true },
    { id: 'e2', source: 'n2', target: 'd1', animated: true },
    { id: 'e3', source: 'd1', target: 'n3', label: '성공', animated: true, style: { stroke: '#22C55E', strokeWidth: 2 } },
    { id: 'e4', source: 'd1', target: 'err1', label: '실패', style: { stroke: '#EF4444' } },

    { id: 'e5', source: 'n3', target: 'n4', animated: true },
    { id: 'e6', source: 'n4', target: 'd2', animated: true },
    { id: 'e7', source: 'd2', target: 'n5', label: '충분', animated: true, style: { stroke: '#22C55E', strokeWidth: 2 } },
    { id: 'e8', source: 'd2', target: 'err2', label: '부족', style: { stroke: '#EF4444' } },
    { id: 'e9', source: 'n4', target: 'note1', style: { stroke: '#9CA3AF', strokeDasharray: '5,5' }, label: '📝' },

    { id: 'e10', source: 'n5', target: 'n6', animated: true },
    { id: 'e11', source: 'n6', target: 'n7', animated: true },
    { id: 'e12', source: 'n7', target: 'd3', animated: true },
    { id: 'e13', source: 'd3', target: 'n8', label: '정상', animated: true, style: { stroke: '#22C55E', strokeWidth: 2 } },
    { id: 'e14', source: 'd3', target: 'err3', label: '충돌', style: { stroke: '#EF4444' } },
    { id: 'e15', source: 'err3', target: 'rollback1', style: { stroke: '#EF4444' } },
    { id: 'e16', source: 'rollback1', target: 'note2', style: { stroke: '#F59E0B', strokeDasharray: '5,5' } },

    { id: 'e17', source: 'n8', target: 'n9', animated: true },
    { id: 'e18', source: 'n9', target: 'n10', animated: true },
    { id: 'e19', source: 'n10', target: 'n11', animated: true },
    { id: 'e20', source: 'n11', target: 'd4', animated: true },
    
    // ⚡ 빌링 시작점 (핵심 포인트 #1)
    { id: 'e21', source: 'd4', target: 'billing-start', label: 'ACTIVE ✅', animated: true, style: { stroke: '#A855F7', strokeWidth: 3 } },
    { id: 'e22', source: 'd4', target: 'note-billing-start', style: { stroke: '#A855F7', strokeDasharray: '5,5' }, label: '💰' },
    
    // ↩️ 롤백 (핵심 포인트 #2)
    { id: 'e23', source: 'd4', target: 'err4', label: 'ERROR', style: { stroke: '#EF4444', strokeWidth: 2 } },
    { id: 'e24', source: 'err4', target: 'rollback2', style: { stroke: '#EF4444' } },
    { id: 'e25', source: 'rollback2', target: 'note3', style: { stroke: '#F59E0B', strokeDasharray: '5,5' } },

    { id: 'e26', source: 'billing-start', target: 'n12', animated: true, style: { stroke: '#A855F7', strokeWidth: 2 } },
    { id: 'e27', source: 'n12', target: 'billing-process', animated: true },
    { id: 'e28', source: 'billing-process', target: 'n13', animated: true },
    { id: 'e29', source: 'n13', target: 'd5', animated: true },
    { id: 'e30', source: 'd5', target: 'n13', label: '계속', animated: true, type: 'smoothstep', style: { stroke: '#22C55E' } },
    { id: 'e31', source: 'billing-process', target: 'note4', style: { stroke: '#9CA3AF', strokeDasharray: '5,5' } },

    { id: 'e32', source: 'd5', target: 'user-delete', label: '삭제', style: { stroke: '#EF4444', strokeWidth: 2 } },
    { id: 'e33', source: 'user-delete', target: 'n14', animated: true },
    { id: 'e34', source: 'n14', target: 'd6', animated: true },
    { id: 'e35', source: 'd6', target: 'n15', label: '삭제', animated: true },
    { id: 'e36', source: 'd6', target: 'volume-keep', label: '보존', style: { stroke: '#F59E0B', strokeWidth: 2 } },
    
    // 💰 찌꺼기 과금 (핵심 포인트 #3)
    { id: 'e37', source: 'volume-keep', target: 'note-orphan-billing', style: { stroke: '#EF4444', strokeDasharray: '5,5' }, label: '💰' },
    
    { id: 'e38', source: 'n15', target: 'n16', animated: true },
    { id: 'e39', source: 'volume-keep', target: 'n16', style: { stroke: '#9CA3AF' } },
    { id: 'e40', source: 'n16', target: 'billing-end', animated: true },
    { id: 'e41', source: 'billing-end', target: 'final-billing', animated: true, style: { stroke: '#A855F7', strokeWidth: 2 } },
    { id: 'e42', source: 'final-billing', target: 'note5', style: { stroke: '#9CA3AF', strokeDasharray: '5,5' }, label: '📝' },

    // ========== 감사 로그 (꼬리표 방식) ==========
    { id: 'e-audit1', source: 'n2', target: 'audit-central', style: { stroke: '#9CA3AF', strokeDasharray: '3,3' } },
    { id: 'e-audit2', source: 'n7', target: 'audit-central', style: { stroke: '#9CA3AF', strokeDasharray: '3,3' } },
    { id: 'e-audit3', source: 'billing-start', target: 'audit-central', style: { stroke: '#9CA3AF', strokeDasharray: '3,3' } },
    { id: 'e-audit4', source: 'billing-end', target: 'audit-central', style: { stroke: '#9CA3AF', strokeDasharray: '3,3' } },
  ]
};
