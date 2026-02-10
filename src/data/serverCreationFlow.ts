import type { Node, Edge } from '@xyflow/react';

export const serverCreationFlowData: { nodes: Node[], edges: Edge[] } = {
  nodes: [
    // ========== STEP 1: 프로젝트 및 권한 준비 (IAM) ==========
    {
      id: 'group-step1',
      type: 'group',
      position: { x: 100, y: 100 },
      data: {
        label: 'Step 1: 프로젝트 및 권한 준비',
        description: 'IAM - 서비스 구성 필요'
      },
      style: { 
        width: 800, 
        height: 1200,
        zIndex: -1,
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        border: '3px solid #6366f1'
      }
    },

    {
      id: 'user-start',
      type: 'process',
      position: { x: 150, y: 200 },
      data: {
        label: '👤 사용자 시작',
        section: 'console',
        icon: '🚀',
        description: '서버 생성 시작'
      },
      style: { width: 200, height: 100 },
      parentId: 'group-step1'
    },

    {
      id: 'step1-mfa',
      type: 'process',
      position: { x: 150, y: 400 },
      data: {
        label: '통합 인증 (MFA)',
        section: 'next-platform',
        icon: '🔐',
        description: '필수'
      },
      style: { width: 200, height: 80 },
      parentId: 'group-step1'
    },

    {
      id: 'step1-project',
      type: 'process',
      position: { x: 150, y: 550 },
      data: {
        label: '프로젝트 생성',
        section: 'next-platform',
        icon: '📁',
        description: '필수'
      },
      style: { width: 200, height: 80 },
      parentId: 'group-step1'
    },

    {
      id: 'step1-permission',
      type: 'process',
      position: { x: 150, y: 700 },
      data: {
        label: '권한 부여',
        section: 'next-platform',
        icon: '✅',
        description: '필수'
      },
      style: { width: 200, height: 80 },
      parentId: 'group-step1'
    },

    {
      id: 'step1-complete',
      type: 'note',
      position: { x: 500, y: 550 },
      data: {
        label: 'Step 1 완료',
        description: '인프라 기반 구성 준비',
        emoji: '✨'
      },
      style: { width: 180, height: 100 },
      parentId: 'group-step1'
    },

    // ========== STEP 2: 인프라 기반 구성 (Network & Security) ==========
    {
      id: 'group-step2',
      type: 'group',
      position: { x: 1100, y: 100 },
      data: {
        label: 'Step 2: 인프라 기반 구성',
        description: 'Network & Security'
      },
      style: { 
        width: 1200, 
        height: 2000,
        zIndex: -1,
        backgroundColor: 'rgba(236, 72, 153, 0.08)',
        border: '3px solid #ec4899'
      }
    },

    {
      id: 'step2-start',
      type: 'note',
      position: { x: 1150, y: 200 },
      data: {
        label: '네트워크 구성 시작',
        description: '서비스 구성 필요',
        emoji: '🌐'
      },
      style: { width: 200, height: 100 },
      parentId: 'group-step2'
    },

    // 네트워크 (L2/L3)
    {
      id: 'step2-vpc',
      type: 'process',
      position: { x: 1150, y: 400 },
      data: {
        label: 'VPC & Subnet',
        section: 'openstack',
        icon: '🔌',
        description: '필수 - 네트워크 (L2/L3)'
      },
      style: { width: 220, height: 100 },
      parentId: 'group-step2'
    },

    {
      id: 'step2-route-table',
      type: 'process',
      position: { x: 1150, y: 580 },
      data: {
        label: 'Route Table',
        section: 'openstack',
        icon: '🗺️',
        description: '필수'
      },
      style: { width: 220, height: 80 },
      parentId: 'group-step2'
    },

    // 앞단 제어 (선택)
    {
      id: 'step2-security-title',
      type: 'note',
      position: { x: 1550, y: 400 },
      data: {
        label: '앞단 제어',
        description: '선택 항목',
        emoji: '🛡️'
      },
      style: { width: 180, height: 80 },
      parentId: 'group-step2'
    },

    {
      id: 'step2-nacl',
      type: 'decision',
      position: { x: 1550, y: 550 },
      data: {
        label: 'NACL',
        description: '선택'
      },
      style: { width: 120, height: 120 },
      parentId: 'group-step2'
    },

    {
      id: 'step2-sg',
      type: 'decision',
      position: { x: 1550, y: 750 },
      data: {
        label: 'Security Group',
        description: '선택'
      },
      style: { width: 140, height: 140 },
      parentId: 'group-step2'
    },

    {
      id: 'step2-keypair',
      type: 'decision',
      position: { x: 1550, y: 970 },
      data: {
        label: 'Key Pair',
        description: '선택'
      },
      style: { width: 120, height: 120 },
      parentId: 'group-step2'
    },

    {
      id: 'step2-complete',
      type: 'note',
      position: { x: 1900, y: 650 },
      data: {
        label: 'Step 2 완료',
        description: '컴퓨팅 자원 준비',
        emoji: '✨'
      },
      style: { width: 180, height: 100 },
      parentId: 'group-step2'
    },

    // ========== STEP 3: 컴퓨팅 자원 프로비저닝 (Compute & Storage) ==========
    {
      id: 'group-step3',
      type: 'group',
      position: { x: 2500, y: 100 },
      data: {
        label: 'Step 3: 컴퓨팅 자원 프로비저닝',
        description: 'Compute & Storage'
      },
      style: { 
        width: 1800, 
        height: 2500,
        zIndex: -1,
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        border: '3px solid #10b981'
      }
    },

    {
      id: 'step3-start',
      type: 'note',
      position: { x: 2550, y: 200 },
      data: {
        label: '서버 생성 시작',
        description: '컴퓨팅 리소스 프로비저닝',
        emoji: '🖥️'
      },
      style: { width: 220, height: 100 },
      parentId: 'group-step3'
    },

    // 기본 생성 (필수)
    {
      id: 'step3-basic-title',
      type: 'note',
      position: { x: 2550, y: 400 },
      data: {
        label: '기본 생성',
        description: '필수 항목',
        emoji: '⚙️'
      },
      style: { width: 180, height: 80 },
      parentId: 'group-step3'
    },

    {
      id: 'step3-os-flavor',
      type: 'process',
      position: { x: 2550, y: 550 },
      data: {
        label: 'OS & Flavor 선택',
        section: 'next-platform',
        icon: '💿',
        description: '필수'
      },
      style: { width: 220, height: 100 },
      parentId: 'group-step3'
    },

    {
      id: 'step3-root-volume',
      type: 'process',
      position: { x: 2550, y: 730 },
      data: {
        label: 'Root Volume',
        section: 'openstack',
        icon: '💾',
        description: '필수 - creating → available'
      },
      style: { width: 220, height: 100 },
      parentId: 'group-step3'
    },

    {
      id: 'step3-data-volume',
      type: 'decision',
      position: { x: 2550, y: 910 },
      data: {
        label: 'Data Volume',
        description: '선택'
      },
      style: { width: 140, height: 140 },
      parentId: 'group-step3'
    },

    // NIC 생성
    {
      id: 'step3-nic-title',
      type: 'note',
      position: { x: 2950, y: 400 },
      data: {
        label: 'NIC 생성',
        description: '네트워크 인터페이스',
        emoji: '🔌'
      },
      style: { width: 180, height: 80 },
      parentId: 'group-step3'
    },

    {
      id: 'step3-nic-vpc',
      type: 'process',
      position: { x: 2950, y: 550 },
      data: {
        label: 'VPC/Subnet 선택',
        section: 'openstack',
        icon: '🌐',
        description: '필수'
      },
      style: { width: 200, height: 100 },
      parentId: 'group-step3'
    },

    {
      id: 'step3-private-ip',
      type: 'decision',
      position: { x: 2950, y: 730 },
      data: {
        label: 'Private IP 할당',
        description: '자동/수동 선택'
      },
      style: { width: 160, height: 160 },
      parentId: 'group-step3'
    },

    // 추가 생성 (선택)
    {
      id: 'step3-additional-title',
      type: 'note',
      position: { x: 3350, y: 400 },
      data: {
        label: '추가 생성',
        description: '선택 항목',
        emoji: '➕'
      },
      style: { width: 180, height: 80 },
      parentId: 'group-step3'
    },

    {
      id: 'step3-sg-optional',
      type: 'decision',
      position: { x: 3350, y: 550 },
      data: {
        label: 'Security Group',
        description: '선택'
      },
      style: { width: 140, height: 140 },
      parentId: 'group-step3'
    },

    {
      id: 'step3-keypair-required',
      type: 'process',
      position: { x: 3350, y: 760 },
      data: {
        label: 'Key Pair',
        section: 'next-platform',
        icon: '🔑',
        description: '필수'
      },
      style: { width: 160, height: 80 },
      parentId: 'group-step3'
    },

    {
      id: 'step3-userdata',
      type: 'decision',
      position: { x: 3350, y: 910 },
      data: {
        label: 'User Data',
        description: '선택'
      },
      style: { width: 120, height: 120 },
      parentId: 'group-step3'
    },

    // Server Build
    {
      id: 'step3-server-build',
      type: 'process',
      position: { x: 2850, y: 1200 },
      data: {
        label: '🏗️ Server Building',
        section: 'openstack',
        icon: '⚙️',
        description: 'OpenStack 서버 생성'
      },
      style: { width: 280, height: 120 },
      parentId: 'group-step3'
    },

    {
      id: 'step3-server-active',
      type: 'process',
      position: { x: 2850, y: 1400 },
      data: {
        label: '✨ Server ACTIVE',
        section: 'openstack',
        icon: '💰',
        description: '빌링 시작!',
        auditLog: '💰 빌링 시작!',
        auditStatus: 'Billing'
      },
      style: { width: 280, height: 120 },
      parentId: 'group-step3'
    },

    {
      id: 'step3-error',
      type: 'note',
      position: { x: 2850, y: 1650 },
      data: {
        label: '⚠️ 생성 실패 시',
        description: '롤백 정책:\n- Root Volume 사용 가능 상태로 복원\n- Data Volume 생성 취소\n- NIC 연결 해제',
        emoji: '🔄'
      },
      style: { width: 280, height: 180, backgroundColor: '#fef3c7', border: '2px solid #f59e0b' },
      parentId: 'group-step3'
    },

    {
      id: 'step3-complete',
      type: 'note',
      position: { x: 3700, y: 1200 },
      data: {
        label: 'Step 3 완료',
        description: '서버 사용 가능',
        emoji: '✨'
      },
      style: { width: 180, height: 100 },
      parentId: 'group-step3'
    },

    // ========== STEP 4: 외부 통신 설정 (Connectivity) ==========
    {
      id: 'group-step4',
      type: 'group',
      position: { x: 4500, y: 100 },
      data: {
        label: 'Step 4: 외부 통신 설정',
        description: 'Connectivity - 선택 항목'
      },
      style: { 
        width: 800, 
        height: 1400,
        zIndex: -1,
        backgroundColor: 'rgba(249, 115, 22, 0.08)',
        border: '3px solid #f97316'
      }
    },

    {
      id: 'step4-start',
      type: 'note',
      position: { x: 4550, y: 200 },
      data: {
        label: '외부 연결 구성',
        description: '모두 선택 항목',
        emoji: '🌍'
      },
      style: { width: 200, height: 100 },
      parentId: 'group-step4'
    },

    {
      id: 'step4-igw-nat',
      type: 'decision',
      position: { x: 4550, y: 400 },
      data: {
        label: 'IGW & NAT Gateway',
        description: '선택'
      },
      style: { width: 180, height: 180 },
      parentId: 'group-step4'
    },

    {
      id: 'step4-floating-ip',
      type: 'decision',
      position: { x: 4550, y: 660 },
      data: {
        label: 'Floating IP',
        description: '선택'
      },
      style: { width: 140, height: 140 },
      parentId: 'group-step4'
    },

    {
      id: 'step4-vpc-peering',
      type: 'decision',
      position: { x: 4550, y: 880 },
      data: {
        label: 'VPC Peering',
        description: '선택'
      },
      style: { width: 140, height: 140 },
      parentId: 'group-step4'
    },

    {
      id: 'step4-health-check',
      type: 'process',
      position: { x: 4900, y: 550 },
      data: {
        label: '상태 확인',
        section: 'next-platform',
        icon: '✅',
        description: '서비스 정상 동작 확인'
      },
      style: { width: 200, height: 100 },
      parentId: 'group-step4'
    },

    {
      id: 'step4-complete',
      type: 'note',
      position: { x: 4900, y: 750 },
      data: {
        label: '🎉 완료!',
        description: 'NEXT 서버 생성 완료\n서비스 운영 시작',
        emoji: '✨'
      },
      style: { width: 200, height: 150, backgroundColor: '#d1fae5', border: '2px solid #10b981' },
      parentId: 'group-step4'
    },

    // ========== 하단 레전드 ==========
    {
      id: 'legend',
      type: 'note',
      position: { x: 100, y: 2800 },
      data: {
        label: '범례',
        description: '● 필수 항목 = 프로세스 박스\n◆ 선택 항목 = 다이아몬드\n📝 = 감사 로그\n💰 = 과금 처리',
        emoji: '📖'
      },
      style: { width: 300, height: 180, backgroundColor: '#f3f4f6', border: '2px solid #9ca3af' }
    },
  ],

  edges: [
    // ========== STEP 1 FLOW ==========
    { id: 'e-start-mfa', source: 'user-start', target: 'step1-mfa', animated: true, label: '서비스 시작' },
    { id: 'e-mfa-project', source: 'step1-mfa', target: 'step1-project', animated: true },
    { id: 'e-project-perm', source: 'step1-project', target: 'step1-permission', animated: true },
    { id: 'e-perm-complete1', source: 'step1-permission', target: 'step1-complete', animated: true },

    // ========== STEP 1 → STEP 2 ==========
    { id: 'e-step1-step2', source: 'step1-complete', target: 'step2-start', animated: true, label: '인프라 구성', style: { stroke: '#ec4899', strokeWidth: 3 } },

    // ========== STEP 2 FLOW ==========
    { id: 'e-step2-vpc', source: 'step2-start', target: 'step2-vpc', animated: true },
    { id: 'e-vpc-route', source: 'step2-vpc', target: 'step2-route-table', animated: true },
    
    // Step 2 Optional
    { id: 'e-vpc-security', source: 'step2-vpc', target: 'step2-security-title', animated: true, label: '선택사항' },
    { id: 'e-security-nacl', source: 'step2-security-title', target: 'step2-nacl', style: { strokeDasharray: '5,5' } },
    { id: 'e-security-sg', source: 'step2-security-title', target: 'step2-sg', style: { strokeDasharray: '5,5' } },
    { id: 'e-security-kp', source: 'step2-security-title', target: 'step2-keypair', style: { strokeDasharray: '5,5' } },
    
    { id: 'e-route-complete2', source: 'step2-route-table', target: 'step2-complete', animated: true },
    { id: 'e-nacl-complete2', source: 'step2-nacl', target: 'step2-complete', style: { strokeDasharray: '5,5' } },
    { id: 'e-sg-complete2', source: 'step2-sg', target: 'step2-complete', style: { strokeDasharray: '5,5' } },
    { id: 'e-kp-complete2', source: 'step2-keypair', target: 'step2-complete', style: { strokeDasharray: '5,5' } },

    // ========== STEP 2 → STEP 3 ==========
    { id: 'e-step2-step3', source: 'step2-complete', target: 'step3-start', animated: true, label: '서버 생성', style: { stroke: '#10b981', strokeWidth: 3 } },

    // ========== STEP 3 FLOW ==========
    // Basic
    { id: 'e-step3-basic', source: 'step3-start', target: 'step3-basic-title', animated: true },
    { id: 'e-basic-os', source: 'step3-basic-title', target: 'step3-os-flavor', animated: true },
    { id: 'e-os-root', source: 'step3-os-flavor', target: 'step3-root-volume', animated: true },
    { id: 'e-root-data', source: 'step3-root-volume', target: 'step3-data-volume', style: { strokeDasharray: '5,5' }, label: '선택' },

    // NIC
    { id: 'e-step3-nic', source: 'step3-start', target: 'step3-nic-title', animated: true },
    { id: 'e-nic-vpc', source: 'step3-nic-title', target: 'step3-nic-vpc', animated: true },
    { id: 'e-vpc-ip', source: 'step3-nic-vpc', target: 'step3-private-ip', animated: true },

    // Additional
    { id: 'e-step3-add', source: 'step3-start', target: 'step3-additional-title', animated: true },
    { id: 'e-add-sg', source: 'step3-additional-title', target: 'step3-sg-optional', style: { strokeDasharray: '5,5' } },
    { id: 'e-add-kp', source: 'step3-additional-title', target: 'step3-keypair-required', animated: true },
    { id: 'e-add-ud', source: 'step3-additional-title', target: 'step3-userdata', style: { strokeDasharray: '5,5' } },

    // Server Build
    { id: 'e-root-build', source: 'step3-root-volume', target: 'step3-server-build', animated: true },
    { id: 'e-data-build', source: 'step3-data-volume', target: 'step3-server-build', animated: true },
    { id: 'e-ip-build', source: 'step3-private-ip', target: 'step3-server-build', animated: true },
    { id: 'e-kp-build', source: 'step3-keypair-required', target: 'step3-server-build', animated: true },
    
    { id: 'e-build-active', source: 'step3-server-build', target: 'step3-server-active', animated: true, label: 'BUILD → ACTIVE 💰', labelStyle: { fill: '#059669', fontWeight: 700 } },
    { id: 'e-build-error', source: 'step3-server-build', target: 'step3-error', style: { stroke: '#f59e0b', strokeWidth: 2 }, label: '실패 시' },
    
    { id: 'e-active-complete3', source: 'step3-server-active', target: 'step3-complete', animated: true },

    // ========== STEP 3 → STEP 4 ==========
    { id: 'e-step3-step4', source: 'step3-complete', target: 'step4-start', animated: true, label: '외부 연결', style: { stroke: '#f97316', strokeWidth: 3 } },

    // ========== STEP 4 FLOW ==========
    { id: 'e-step4-igw', source: 'step4-start', target: 'step4-igw-nat', style: { strokeDasharray: '5,5' } },
    { id: 'e-step4-fip', source: 'step4-start', target: 'step4-floating-ip', style: { strokeDasharray: '5,5' } },
    { id: 'e-step4-peering', source: 'step4-start', target: 'step4-vpc-peering', style: { strokeDasharray: '5,5' } },
    
    { id: 'e-igw-health', source: 'step4-igw-nat', target: 'step4-health-check', style: { strokeDasharray: '5,5' } },
    { id: 'e-fip-health', source: 'step4-floating-ip', target: 'step4-health-check', style: { strokeDasharray: '5,5' } },
    { id: 'e-peering-health', source: 'step4-vpc-peering', target: 'step4-health-check', style: { strokeDasharray: '5,5' } },
    
    { id: 'e-health-complete4', source: 'step4-health-check', target: 'step4-complete', animated: true },
  ]
};