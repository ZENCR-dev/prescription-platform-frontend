# TASK02.md - Shared Supabase Project & AUTH Integration
## Layer 2 SOP: Component-Based AUTH Integration with TDD Development

**Task Category**: Authentication & Database Integration  
**Phase**: Week 1 - Foundation Setup  
**Priority**: Critical (Enables parallel AUTH development)  
**Estimated Time**: 20-28 hours (5 components × 4-8 hours each)  
**Prerequisites**: TASK01 completed successfully  
**Backend Coordination**: Shared Supabase project for both teams  
**Git Branch**: `feature/task02-supabase-auth`  

---

## 🎯 Task Objectives & User Stories

Create and configure a shared Supabase project using component-based development approach that enables both frontend and backend teams to work on authentication features simultaneously. Each component supports the Layer3 TDD-Todos 9-step development cycle for reliable AUTH integration.

### User Stories Served
- **US6**: As both frontend and backend developer, I want a shared Supabase project so we can collaborate on AUTH
- **US7**: As a user, I want working authentication so I can securely access the medical platform
- **US8**: As a medical practitioner, I want role-based access appropriate for my professional context
- **US9**: As a privacy-conscious user, I want my data protected according to medical privacy standards  
- **US10**: As a developer, I want tested AUTH flows so I know the system works reliably

### Success Criteria
- 5 functional AUTH components with TDD test coverage
- Shared Supabase project operational for both teams
- Privacy-compliant user schema without patient PII
- Complete AUTH flow testing and validation
- Frontend-backend coordination protocols established

---

## 🧩 Component-Based Minimum Unit Tasks (4-8 Hours Each)

### Component 1: Shared Project Component
**User Story**: US6 - Shared Supabase project for frontend-backend AUTH collaboration
**Deliverable**: Supabase project accessible to both teams with proper configuration
**Time Estimate**: 4-6 hours
**Layer3 TDD-Todos Ready**: Test-driven project setup and team access validation

**Component Requirements**:
```typescript
interface SharedProjectComponent {
  supabaseProject: SupabaseProjectConfig
  teamAccess: TeamAccessConfig
  projectSettings: ProjectSettingsConfig
  backupStrategy: BackupConfig
  monitoringSetup: MonitoringConfig
}
```

**Minimum Unit Tasks**:
- **2.1a**: Create Supabase project with optimal configuration for medical platform
- **2.1b**: Configure team access permissions and API key management
- **2.1c**: Set up project monitoring and backup strategies
- **2.1d**: Document project configuration for backend team coordination

**TDD-Ready Deliverables**:
- Unit tests for project configuration validation
- Integration tests for team access permissions
- Monitoring tests for project health metrics
- Documentation tests for configuration accuracy

**SuperClaude Workflow Integration**:
```bash
# Shared Project Setup - DevOps & Security Focus
/sc:implement "shared Supabase project setup" --persona-devops --persona-security --validate --c7
# → Auto-activates: DevOps for infrastructure setup, Security for access control,
#   Context7 for Supabase best practices, validation for team coordination

# Alternative for comprehensive project setup
/sc:build "Supabase collaboration project" --persona-devops --safe-mode --seq
# → Use for complex multi-team configuration with systematic validation
```
**Efficiency Gains**: 60-80% faster project setup through Supabase pattern automation and team access orchestration.

---

### Component 2: AUTH Integration Component  
**User Story**: US7 - Working authentication for secure medical platform access
**Deliverable**: Starter kit connected to Supabase with functional AUTH flows
**Time Estimate**: 5-7 hours
**Layer3 TDD-Todos Ready**: Test-driven AUTH connection and flow validation

**Component Requirements**:
```typescript
interface AuthIntegrationComponent {
  supabaseConnection: SupabaseClientConfig
  authFlows: AuthFlowConfig
  sessionManagement: SessionConfig
  errorHandling: AuthErrorConfig
  uiIntegration: AuthUIConfig
}
```

**Minimum Unit Tasks**:
- **2.2a**: Connect starter kit to shared Supabase project via environment configuration
- **2.2b**: Validate login, signup, and password reset flows
- **2.2c**: Implement session management and persistence
- **2.2d**: Configure AUTH error handling and user feedback

**TDD-Ready Deliverables**:
- Unit tests for Supabase connection validation
- Integration tests for AUTH flow functionality
- E2E tests for complete user authentication journey
- Performance tests for AUTH response times

**SuperClaude Workflow Integration**:
```bash
# AUTH Integration - Security & Frontend Focus
/sc:implement "Supabase AUTH integration" --persona-security --persona-frontend --seq --c7
# → Auto-activates: Security for AUTH patterns, Frontend for UI flows,
#   Sequential for complex integration logic, Context7 for Supabase AUTH patterns

# Alternative for comprehensive AUTH setup
/sc:build "complete AUTH system" --persona-security --magic --c7 --validate
# → Use for complete AUTH with UI components and security validation
```
**Efficiency Gains**: 70-85% faster AUTH integration through Supabase pattern recognition and security-first implementation.

---

### Component 3: User Schema Component
**User Story**: US8 & US9 - Role-based access with privacy-compliant medical user profiles
**Deliverable**: User profile schema without patient PII supporting medical roles
**Time Estimate**: 6-8 hours
**Layer3 TDD-Todos Ready**: Test-driven schema design and privacy validation

**Component Requirements**:
```typescript
interface UserSchemaComponent {
  userRoles: MedicalRoleDefinitions
  userProfiles: UserProfileSchema
  privacyCompliance: PrivacyValidationConfig
  rlsPolicies: RLSPolicyConfig
  schemaValidation: SchemaValidationConfig
}
```

**Minimum Unit Tasks**:
- **2.3a**: Design medical user roles (practitioner, pharmacy, admin, guest)
- **2.3b**: Implement privacy-compliant user profile schema (no patient PII)
- **2.3c**: Create RLS policies for user data access control
- **2.3d**: Validate GDPR/HIPAA compliance for user data model

**TDD-Ready Deliverables**:
- Unit tests for user role validation
- Privacy compliance tests (PII detection)
- RLS policy tests for data access control
- Schema migration tests for database consistency

**SuperClaude Workflow Integration**:
```bash
# User Schema - Security & Architecture Focus
/sc:analyze "privacy-compliant user schema" --persona-security --persona-architect --seq --validate
# → Auto-activates: Security for privacy compliance, Architect for schema design,
#   Sequential for complex RLS policy analysis, validation for GDPR/HIPAA compliance

# Alternative for implementation-focused approach
/sc:implement "medical user roles and RLS" --persona-security --think-hard --c7
# → Use for deep privacy analysis and comprehensive role-based access implementation
```
**Efficiency Gains**: 75-90% faster schema design through privacy pattern automation and RLS policy intelligence.

---

### Component 4: AUTH Validation Component
**User Story**: US10 - Tested AUTH flows for reliable system operation
**Deliverable**: Comprehensive AUTH testing suite with validation results
**Time Estimate**: 5-7 hours
**Layer3 TDD-Todos Ready**: Test-driven AUTH scenario validation

**Component Requirements**:
```typescript
interface AuthValidationComponent {
  testSuites: AuthTestSuiteConfig
  validationScenarios: ValidationScenarioConfig
  performanceTesting: PerformanceTestConfig
  securityTesting: SecurityTestConfig
  integrationTesting: IntegrationTestConfig
}
```

**Minimum Unit Tasks**:
- **2.4a**: Implement comprehensive AUTH flow testing scenarios
- **2.4b**: Create user role assignment and validation tests
- **2.4c**: Develop performance and security testing for AUTH operations
- **2.4d**: Build integration tests for frontend-backend AUTH coordination

**TDD-Ready Deliverables**:
- Unit tests for individual AUTH operations
- Integration tests for AUTH flow sequences
- Performance benchmarks for AUTH response times
- Security validation tests for AUTH vulnerabilities

**SuperClaude Workflow Integration**:
```bash
# AUTH Validation - QA & Security Focus
/sc:test "comprehensive AUTH validation" --persona-qa --persona-security --play --seq
# → Auto-activates: QA for testing expertise, Security for vulnerability assessment,
#   Playwright for E2E AUTH testing, Sequential for systematic validation

# Alternative for performance-focused testing
/sc:analyze "AUTH performance and security" --persona-performance --persona-security --seq
# → Use for comprehensive performance benchmarking and security analysis
```
**Efficiency Gains**: 80-95% faster AUTH testing through automated E2E scenarios and security pattern validation.

---

### Component 5: Coordination Protocol Component
**User Story**: US6 - Frontend-backend collaboration framework for AUTH development
**Deliverable**: Documentation and protocols enabling parallel AUTH development
**Time Estimate**: 4-6 hours
**Layer3 TDD-Todos Ready**: Test-driven coordination protocol validation

**Component Requirements**:
```typescript
interface CoordinationProtocolComponent {
  apiContracts: AuthAPIContractConfig
  communicationProtocols: TeamCommunicationConfig
  testingStrategies: CoordinatedTestingConfig
  deploymentProtocols: DeploymentCoordinationConfig
  documentationStandards: DocumentationConfig
}
```

**Minimum Unit Tasks**:
- **2.5a**: Document AUTH API contracts for frontend-backend coordination
- **2.5b**: Establish testing strategies for integrated AUTH development
- **2.5c**: Create deployment protocols for coordinated releases
- **2.5d**: Set up communication channels and documentation standards

**TDD-Ready Deliverables**:
- Unit tests for API contract validation
- Integration tests for team coordination workflows
- Documentation tests for protocol completeness
- Communication tests for team synchronization

**SuperClaude Workflow Integration**:
```bash
# Coordination Protocol - Documentation & Architecture Focus
/sc:document "AUTH coordination protocols" --persona-scribe --persona-architect --seq --c7
# → Auto-activates: Scribe for professional documentation, Architect for system protocols,
#   Sequential for complex coordination analysis, Context7 for API documentation patterns

# Alternative for comprehensive protocol setup
/sc:analyze "team coordination workflows" --persona-architect --seq --validate
# → Use for systematic coordination analysis and protocol validation
```
**Efficiency Gains**: 60-80% faster protocol development through documentation automation and coordination pattern intelligence.

---

## 🌊 Wave Mode Analysis & AUTH Orchestration

**Wave Eligibility Assessment**: ✅ **QUALIFIED**
- **Complexity Score**: 0.9 (Critical - 5 coordinated AUTH components with security requirements)
- **File Count**: >25 (Supabase project + AUTH components + RLS policies + tests)
- **Operation Types**: >3 (implement, analyze, test, document, coordinate)

**Recommended Wave Strategy**: `--wave-mode progressive`
```bash
# TASK02 Wave Mode Execution - Progressive AUTH Integration
/sc:implement "complete AUTH integration" --wave-mode progressive --persona-security --seq --c7
# → Orchestrates all 5 AUTH components with:
#   Wave 1: Shared Project Foundation (Component 1)
#   Wave 2: AUTH Integration Core (Component 2)
#   Wave 3: User Schema & RLS (Component 3) 
#   Wave 4: AUTH Validation & Testing (Component 4)
#   Wave 5: Coordination Protocols (Component 5)

# Alternative: Security-First AUTH Development
/sc:analyze "AUTH security architecture" --wave-mode systematic --persona-security --think-hard
# → Deep security analysis across all AUTH components with progressive implementation
```

**Wave Mode Benefits**:
- **85-95% Efficiency Gain**: Compound security intelligence across AUTH boundaries
- **Progressive Security**: Incremental security validation at each wave boundary
- **Team Coordination**: Automatic documentation and protocol generation
- **Privacy Compliance**: Systematic GDPR/HIPAA validation across all components

**AUTH-Specific Wave Features**:
- **Security Orchestration**: Progressive security hardening across waves
- **RLS Policy Coordination**: Intelligent policy generation and validation
- **Team Synchronization**: Automatic backend coordination protocol updates
- **Compliance Validation**: Continuous privacy compliance checking

**Delegation Opportunities**:
- **Components 1, 5**: Infrastructure and documentation via `--delegate parallel_tasks`
- **Components 2, 3, 4**: Sequential AUTH core requiring security coordination
- **Testing**: Parallel security validation across all components via `--concurrency 3`

---

## 🚨 Backend Coordination Requirements

**Shared Project Access Checkpoint**:
- Provide backend team with Component 1 (Shared Project) access credentials
- Share Component 3 (User Schema) specifications for database alignment
- Coordinate Component 2 (AUTH Integration) patterns with backend AUTH logic
- Establish Component 5 (Coordination Protocol) frameworks for ongoing collaboration

**Coordination Timing**: After Component 1 completion (Shared Project)
**Responsible Party**: Frontend team creates project, backend team confirms access and schema alignment
**Completion Criteria**: Both teams can connect to and work with shared Supabase project

**AUTH Development Protocols**:
- Frontend focuses on AUTH UI components and user experience flows
- Backend focuses on AUTH business logic and API endpoint development
- Both teams test against same user database and authentication system
- Shared understanding of user roles and privacy compliance requirements

---

## ✅ Validation & Testing Strategy

### Component Integration Testing

Each component must pass Layer3 TDD-Todos validation before integration:

```bash
# Component validation script
cat > scripts/validate-auth-components.sh << 'EOF'
#!/bin/bash
# TASK02 - AUTH Component-Based Integration Validation

echo "🔐 TASK02 - AUTH Component-Based Integration Validation"
echo "====================================================="

components=("SharedProject" "AuthIntegration" "UserSchema" "AuthValidation" "CoordinationProtocol")
validation_results=()

for component in "${components[@]}"; do
    echo ""
    echo "🔍 Testing Component: $component"
    echo "----------------------------------------"
    
    # Run component-specific tests
    case $component in
        "SharedProject")
            test_cmd="curl -s \$NEXT_PUBLIC_SUPABASE_URL/rest/v1/ | grep -q 'OpenAPI'"
            ;;
        "AuthIntegration")
            test_cmd="npm run test:auth-integration && npm run test:auth-flows"
            ;;
        "UserSchema")
            test_cmd="npm run test:user-schema && npm run test:privacy-compliance"
            ;;
        "AuthValidation")
            test_cmd="npm run test:auth-validation && npm run test:security"
            ;;
        "CoordinationProtocol")
            test_cmd="npm run test:coordination && npm run validate:documentation"
            ;;
    esac
    
    if eval "$test_cmd" > /dev/null 2>&1; then
        echo "✅ $component Component - PASSED"
        validation_results+=("PASS")
    else
        echo "❌ $component Component - FAILED"
        validation_results+=("FAIL")
    fi
done

# Final AUTH integration test
echo ""
echo "🔗 AUTH Component Integration Test"
echo "----------------------------------------"
if npm run test:auth-integration-e2e > /dev/null 2>&1; then
    echo "✅ AUTH Component Integration - PASSED"
    validation_results+=("PASS")
else
    echo "❌ AUTH Component Integration - FAILED"
    validation_results+=("FAIL")
fi

# Summary
passed_count=$(printf '%s\n' "${validation_results[@]}" | grep -c "PASS")
total_count=${#validation_results[@]}

echo ""
echo "📊 TASK02 AUTH Component Validation Summary"
echo "====================================================="
echo "Components Passed: $passed_count/$total_count"

if [ $passed_count -eq $total_count ]; then
    echo "🎉 TASK02 COMPLETED SUCCESSFULLY"
    echo ""
    echo "✅ All 5 AUTH components validated and integrated"
    echo "✅ Shared Supabase project operational for both teams"
    echo "✅ Privacy-compliant user schema implemented"
    echo "✅ AUTH flows tested and validated comprehensively"
    echo "✅ Frontend-backend coordination protocols established"
    echo ""
    echo "🚀 Ready to proceed to TASK03: Authentication Component Migration"
    echo ""
    echo "📋 Next Steps for Both Teams:"
    echo "  1. Frontend: Begin AUTH UI component development"
    echo "  2. Backend: Start AUTH business logic implementation"
    echo "  3. Coordinated: Test against shared Supabase project"
    echo "  4. Integration: Validate AUTH flows across team boundaries"
    exit 0
else
    echo "⚠️  TASK02 INCOMPLETE - Address failed AUTH component validations"
    echo ""
    echo "🔧 Component-Specific Troubleshooting:"
    echo "1. SharedProject: Check Supabase project configuration and team access"
    echo "2. AuthIntegration: Verify starter kit connection and AUTH flows"
    echo "3. UserSchema: Validate privacy compliance and RLS policies"
    echo "4. AuthValidation: Review test coverage and security validation"
    echo "5. CoordinationProtocol: Ensure documentation and team alignment"
    exit 1
fi
EOF

chmod +x scripts/validate-auth-components.sh
```

### Manual Verification Protocol

**Supabase Project Verification**:
1. Open Supabase Dashboard and verify project accessibility
2. Check user_profiles table exists with privacy-compliant schema
3. Verify RLS policies are applied and functional
4. Test authentication section accessibility for both teams

**AUTH Flow Testing Checklist**:
```bash
# Manual AUTH testing protocol
# 1. Start Next.js application: npm run dev
# 2. Navigate to http://localhost:3000
# 3. Test user signup flow with email verification
# 4. Test user login flow with session persistence
# 5. Test password reset flow with email handling
# 6. Test role-based access with medical roles
# 7. Test logout functionality and session cleanup
# 8. Verify AUTH state persistence across page refreshes
```

**Privacy Compliance Validation**:
```sql
-- Connect to Supabase project via SQL Editor and verify:

-- Test 1: Verify no patient PII fields exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name LIKE '%patient%';
-- Should return no results (privacy compliant)

-- Test 2: Verify medical role types
SELECT unnest(enum_range(NULL::user_role));
-- Should return: practitioner, pharmacy, admin, guest

-- Test 3: Verify RLS policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'user_profiles';
-- Should show user access control policies

-- Test 4: Test user profile privacy
SELECT id, role, display_name, professional_id, pharmacy_name
FROM user_profiles 
LIMIT 1;
-- Should show only professional context, no patient data
```

---

## 🔄 Layer 3 Integration Notes

**For Agents**: Each component task (2.1-2.5) should generate separate TDD-todos following the **Enhanced 9-Step Development Cycle**:

### Layer3 TDD-Todos Development Cycle (9-Step Enhanced)
1. **获取最小任务** - Extract 4-8 hour atomic task from component requirements
2. **编写测试** - Write unit tests for AUTH component functionality
3. **最小实现** - Minimal code to satisfy AUTH test requirements
4. **业务逻辑** - Integrate Supabase CLI, implement complete AUTH business functionality
5. **安全检查** - Security validation and privacy compliance checks
6. **性能优化** - AUTH performance optimization and response time benchmarking
7. **代码重构** - Code refactoring for AUTH maintainability and security clarity
8. **最终验证** - End-to-end AUTH testing, integration testing with other components
9. **Git提交** - Security policy check then commit to `feature/task02-supabase-auth` branch with concise commit message

**Branch Strategy**: All AUTH component commits go to `feature/task02-supabase-auth` branch until all components complete, then ready for user-controlled merge to main.

**Component Dependencies**:
- Component 1 (Shared Project) → Component 2 (AUTH Integration)
- Component 2 (AUTH Integration) → Component 3 (User Schema)
- Component 3 (User Schema) → Component 4 (AUTH Validation)
- Component 5 (Coordination Protocol) → All components (provides coordination framework)

**Key Benefits**:
- Enables parallel frontend-backend AUTH development
- Single source of truth for user authentication and profiles
- Privacy-compliant user schema from the start
- Systematic TDD approach ensures reliable AUTH system

---

**Task Dependencies**: TASK01 (Starter Kit Foundation)  
**Next Task**: TASK03 (Authentication Component Migration)  
**Critical Success Factor**: Component-based AUTH integration enables both teams to work on AUTH simultaneously  
**AUTH Focus**: Frontend provides AUTH UI components, backend provides AUTH business logic, shared Supabase foundation enables seamless collaboration