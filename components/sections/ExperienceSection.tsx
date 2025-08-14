/**
 * Experience section component displaying skills and leadership experience.
 * Uses experience configuration for data and consistent styling.
 */

import React, { FC } from 'react';
import { Badge } from '@/components/ui/Badge';
import { experience } from '@/config/experience';

interface Props {
    className?: string;
}

/**
 * Experience section displaying technical skills and leadership experience.
 * Loads data from configuration and uses consistent styling.
 */
export const ExperienceSection: FC<Props> = ({ className = '' }) => {
    return (
        <section id="experience" className={`py-20 px-6 bg-white ${className}`}>
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <h2 className="text-4xl font-bold text-primary mb-12 text-center">
                    Experience & Expertise
                </h2>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Technical Skills */}
                    <div>
                        <h3 className="text-2xl font-semibold text-primary mb-6">Technical Skills</h3>
                        <div className="space-y-4">
                            {experience.technicalSkills.map(category => (
                                <div key={category.name}>
                                    <h4 className="font-medium text-primary mb-2">{category.name}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {category.skills.map(skill => (
                                            <Badge key={skill} variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leadership Experience */}
                    <div>
                        <h3 className="text-2xl font-semibold text-primary mb-6">Leadership & Management</h3>
                        <div className="space-y-4">
                            {experience.leadershipItems.map(item => (
                                <div key={item.title} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-action rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <h4 className="font-medium text-primary">{item.title}</h4>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
