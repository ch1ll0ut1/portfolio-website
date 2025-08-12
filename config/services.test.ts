/**
 * Tests for services configuration module.
 * Tests data integrity and structure, not function behavior.
 */

import { describe, it, expect } from 'vitest';
import { services } from './services';

describe('Services Configuration', () => {
    describe('Services Data Integrity', () => {
        it('should have unique service IDs', () => {
            // Act
            const ids = services.map(s => s.id);
            const uniqueIds = [...new Set(ids)];

            // Assert
            expect(uniqueIds).toHaveLength(ids.length);
        });

        it('should have non-empty titles and descriptions', () => {
            // Assert
            services.forEach((service) => {
                expect(service.title).toBeTruthy();
                expect(service.description).toBeTruthy();
                expect(service.title.length).toBeGreaterThan(0);
                expect(service.description.length).toBeGreaterThan(0);
            });
        });

        it('should have at least 3 features per service', () => {
            // Assert
            services.forEach((service) => {
                expect(service.features).toHaveLength(5); // All services have exactly 5 features
            });
        });

        it('should have valid service structure', () => {
            // Assert
            services.forEach((service) => {
                expect(service).toMatchObject({
                    id: expect.any(String),
                    title: expect.any(String),
                    description: expect.any(String),
                    features: expect.arrayContaining([expect.any(String)]),
                    icon: expect.anything(), // Lucide icons are React components
                });
            });
        });

        it('should include expected core services', () => {
            // Act
            const serviceIds = services.map(s => s.id);

            // Assert
            expect(serviceIds).toContain('app-development');
            expect(serviceIds).toContain('team-leadership');
            expect(serviceIds).toContain('technology-strategy');
            expect(serviceIds).toContain('ai-consulting');
            expect(serviceIds).toContain('deployment-maintenance');
            expect(serviceIds).toContain('system-integration');
        });

        it('should have exactly 6 services', () => {
            // Assert
            expect(services).toHaveLength(6);
        });
    });
});
