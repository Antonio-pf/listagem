# Test Documentation: Login and Reservation Control System

## Test Environment
- URL: http://localhost:3001
- Browser: Any modern browser (Chrome, Safari, Firefox)
- Test Date: 2026-01-11

## Test Scenarios

### Test 1: Initial Login Flow
**Objective**: Verify that unauthenticated users are prompted to login

**Steps**:
1. Open http://localhost:3001 in browser
2. Verify that login modal appears automatically
3. Enter name: "Maria Silva"
4. Check "Estou acompanhado(a)" checkbox
5. Click "Entrar" button

**Expected Results**:
- ✓ Login modal closes
- ✓ Header shows user name "Maria Silva" with "+1" badge
- ✓ All gifts are available to reserve

### Test 2: Reserve a Gift
**Objective**: Verify that logged-in users can reserve gifts

**Steps**:
1. Being logged in as "Maria Silva"
2. Click "Quero Presentear" on "Sofá Retrátil"
3. Observe the gift card state

**Expected Results**:
- ✓ Gift shows as "Reservado"
- ✓ Shows "Reservado por você" text
- ✓ "Cancelar Reserva" button appears
- ✓ Gift remains reserved after page refresh

### Test 3: Cancel Own Reservation
**Objective**: Verify that users can cancel their own reservations

**Steps**:
1. Being logged in as "Maria Silva"
2. Click "Cancelar Reserva" on the reserved gift
3. Observe the gift card state

**Expected Results**:
- ✓ Gift becomes available again
- ✓ "Quero Presentear" button appears
- ✓ Toast notification shows cancellation message

### Test 4: Logout and Login as Different User
**Objective**: Verify that different users see each other's reservations

**Steps**:
1. Click logout button in header
2. Verify login modal appears again
3. Enter name: "João Santos"
4. Do NOT check "Estou acompanhado(a)"
5. Click "Entrar"
6. Navigate to gifts list

**Expected Results**:
- ✓ Header shows "João Santos" without "+1" badge
- ✓ Previously reserved gift by Maria shows "Reservado por Maria Silva + acompanhante"
- ✓ No "Cancelar Reserva" button appears on Maria's reservations

### Test 5: Reserve Different Gift as Second User
**Objective**: Verify that multiple users can reserve different gifts

**Steps**:
1. Being logged in as "João Santos"
2. Click "Quero Presentear" on "Jogo de Panelas"
3. Observe the gift card state

**Expected Results**:
- ✓ Gift shows as "Reservado"
- ✓ Shows "Reservado por você" for João
- ✓ "Cancelar Reserva" button appears only for João's reservation

### Test 6: PIX Contribution with Authentication
**Objective**: Verify that PIX contributions require authentication

**Steps**:
1. Logout if logged in
2. Try to click "Contribuir via PIX" on "Contribuição Livre"
3. Enter login credentials
4. Try PIX contribution again

**Expected Results**:
- ✓ Login modal appears when trying to contribute while logged out
- ✓ After login, PIX dialog opens successfully
- ✓ Can enter amount and copy PIX code

### Test 7: Data Persistence
**Objective**: Verify that reservations persist across sessions

**Steps**:
1. Note all current reservations
2. Refresh the page (F5)
3. Check if login session persists
4. Check if all reservations are still there

**Expected Results**:
- ✓ User remains logged in after refresh
- ✓ All reservations are maintained
- ✓ Reservation ownership is preserved

### Test 8: LocalStorage Inspection
**Objective**: Verify data structure in localStorage

**Steps**:
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Navigate to Local Storage
4. Check for keys: "gift-list-auth" and "gift-list-reservations"

**Expected Data Structure**:
```json
// gift-list-auth
{
  "name": "Maria Silva",
  "hasCompanion": true
}

// gift-list-reservations
[
  {
    "giftId": "1",
    "userName": "Maria Silva",
    "hasCompanion": true,
    "reservedAt": "2026-01-11T22:00:00.000Z"
  }
]
```

## Edge Cases to Test

### Edge Case 1: Empty Name
**Steps**: Try to login with empty name field
**Expected**: Submit button should be disabled

### Edge Case 2: Multiple Reservations Same User
**Steps**: Reserve multiple gifts with same user
**Expected**: All reservations should be tracked independently

### Edge Case 3: Logout Clears Session
**Steps**: Logout and check localStorage
**Expected**: "gift-list-auth" should be removed, reservations remain

## Browser Compatibility Testing
- [ ] Chrome/Edge
- [ ] Safari
- [ ] Firefox
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Performance Checks
- [ ] Login response is instant (<100ms)
- [ ] Reservation updates are instant
- [ ] Page load with reservations is fast
- [ ] No console errors during normal usage

## Test Results Summary

Date: _____________
Tester: _____________

| Test Scenario | Status | Notes |
|--------------|--------|-------|
| Test 1: Initial Login | ⬜ | |
| Test 2: Reserve Gift | ⬜ | |
| Test 3: Cancel Reservation | ⬜ | |
| Test 4: Different User | ⬜ | |
| Test 5: Multiple Reservations | ⬜ | |
| Test 6: PIX Authentication | ⬜ | |
| Test 7: Data Persistence | ⬜ | |
| Test 8: LocalStorage | ⬜ | |

## Known Limitations
1. Data is stored locally in browser - not synced across devices
2. Multiple users can have the same name (no unique identifier check)
3. No server-side validation or backup
4. Clearing browser data will lose all reservations

## Future Enhancements
1. Backend API for centralized data storage
2. Real-time synchronization across devices
3. Email notifications for reservation confirmations
4. Admin panel to view all reservations
5. Export functionality for guest list
