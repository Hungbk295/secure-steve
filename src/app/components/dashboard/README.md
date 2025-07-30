# Alert Notification Panel

## Overview

The Alert Notification Panel is a comprehensive component for displaying and managing security alerts in the dashboard. It provides a table view for desktop and a card view for mobile devices, with role-based permissions and action management.

## Features

### Core Features
- **Real-time Alert Display**: Shows latest security alerts with detailed information
- **Role-based Permissions**: Different capabilities for User vs Administrator roles
- **Action Management**: Quarantine, delete, and other security actions with confirmation
- **Responsive Design**: Table view on desktop, card view on mobile
- **CSV Export**: Download alert data as CSV file
- **Sorting & Filtering**: Sort by risk level, filter by status

### Data Fields
- **Alert Icon**: Visual indicator (🔴 High, 🟡 Medium, 🟢 Low)
- **Alert Name**: Descriptive name of the security alert
- **File/Server**: File name and server IP address
- **Risk/Verdict**: Risk percentage and verdict (Malware/Benign/Suspicious)
- **Timing**: Created date/time and analyzed time
- **Status**: Current status with filtering options
- **Actions**: Dropdown for status changes (role-dependent)

## Usage

### Basic Implementation

```tsx
import AlertNotificationPanel from "@/app/components/dashboard/AlertNotificationPanel";

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <AlertNotificationPanel />
      {/* Other dashboard components */}
    </div>
  );
}
```

### Role-based Features

The component automatically adapts based on user role:

#### User Role
- View alerts only
- Cannot change alert status
- Limited to personal/group alerts

#### Administrator Role
- Full alert management
- Can change alert status
- Access to all system alerts
- Can perform quarantine/delete actions

### Action Workflow

1. **View Alert**: Click on alert name to navigate to analysis page
2. **Change Status**: Use dropdown to change alert status
3. **Confirmation**: Sensitive actions (quarantine/delete) require confirmation modal
4. **Memo Required**: Security actions require reason/memo input
5. **Audit Trail**: All actions are logged for compliance

## API Integration

### Endpoints Used

```typescript
// Fetch latest alerts
GET /analysis/requests/latest
Response: {
  alerts: Alert[],
  totalCount: number
}

// Update alert action
PUT /analysis/requests/:id/action
Body: {
  action: "pending" | "no_action" | "quarantine" | "delete",
  memo?: string
}

// Download CSV
GET /analysis/requests/latest?format=csv
Response: CSV file download
```

### Data Structure

```typescript
interface Alert {
  id: string;
  fileName: string;
  serverIP: string;
  riskLevel: "high" | "medium" | "low";
  malwareType: string;
  createdAt: string;
  status: "pending" | "no_action" | "quarantine" | "delete";
  completedAt?: string;
  // Extended fields
  icon: string;
  alertName: string;
  riskPercentage: number;
  verdict: "Malware" | "Benign" | "Suspicious";
  analyzedAt: string;
}
```

## Styling

### CSS Classes

The component uses CSS modules for styling:

- `.alerts-notification-table`: Main table styling
- `.mobile-alert-cards`: Mobile card container
- `.risk-tag-*`: Risk level indicators
- `.status-*`: Status indicators
- `.action-confirm-modal`: Confirmation modal styling

### Responsive Breakpoints

- **Desktop (≥768px)**: Table view with full columns
- **Mobile (<768px)**: Card view with condensed information

## Security Considerations

### Action Permissions
- Sensitive actions require administrator role
- Confirmation modal for destructive actions
- Memo requirement for audit trail
- Real-time permission checking

### Data Protection
- Role-based data filtering
- Secure API endpoints
- Input validation for memo fields
- XSS protection for displayed data

## Accessibility

### Features
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators
- High contrast support
- Semantic HTML structure

### Testing
- Screen reader compatibility
- Keyboard-only navigation
- Color contrast compliance
- Mobile accessibility

## Performance

### Optimizations
- Virtualized table for large datasets
- Lazy loading for mobile cards
- Memoized components
- Efficient re-rendering
- CSS modules for styling

### Monitoring
- Loading states for all actions
- Error handling and recovery
- Network request optimization
- Memory usage monitoring

## Troubleshooting

### Common Issues

1. **Actions not working**
   - Check user role permissions
   - Verify API endpoints
   - Check network connectivity

2. **Mobile view not showing**
   - Verify responsive CSS classes
   - Check viewport meta tag
   - Test on actual devices

3. **CSV download failing**
   - Check browser download permissions
   - Verify data format
   - Test with different browsers

### Debug Mode

Enable debug logging:

```typescript
// In component
console.log("Alert data:", latestAlerts);
console.log("User permissions:", topBarFeatures);
```

## Future Enhancements

### Planned Features
- Real-time WebSocket updates
- Advanced filtering options
- Bulk action support
- Custom alert templates
- Integration with SIEM systems

### Performance Improvements
- Virtual scrolling for large datasets
- Progressive loading
- Background sync
- Offline support

## Dependencies

### Required Packages
- `antd`: UI components
- `react`: Core framework
- `@reduxjs/toolkit`: State management

### Optional Packages
- `dayjs`: Date formatting
- `react-router-dom`: Navigation
- `lodash`: Utility functions

## Contributing

### Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Run tests: `npm test`
4. Build for production: `npm run build`

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Jest for testing

### Testing Requirements
- Unit tests for all functions
- Integration tests for user flows
- Accessibility testing
- Cross-browser testing
