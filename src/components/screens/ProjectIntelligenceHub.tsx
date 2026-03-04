'use client';

import { useMemo } from 'react';
import { ArrowLeft, Building2, Crosshair, Globe2, Hotel, Landmark, MapPinned, Mountain, Shield, Sparkles, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DRC_PROJECTS,
  GOLD_BELTS,
  getDRCProjectById,
  getDRCProjectsByBelt,
  getDRCProjectsByProvince,
} from '@/data/drc-projects';
import { getIntelByProvince } from '@/data/drc-local-intel';
import { getHotelsForProject } from '@/data/drc-hotels';
import { getSportsByProvince } from '@/data/drc-sports';
import { getLandmarksByProvince } from '@/data/drc-landmarks';
import { getGovernmentByProvince } from '@/data/drc-government';
import { getCultureByRegion } from '@/data/drc-culture';
import { getInfrastructureByProvince } from '@/data/drc-infrastructure';
import { usePursuit } from '@/hooks/usePursuitContext';

interface ProjectIntelligenceHubProps {
  projectId?: string;
  properties?: Record<string, unknown>;
  onBack?: () => void;
}

function uniqueByKey<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function resolveProjectId(projectId?: string, properties?: Record<string, unknown>) {
  if (projectId) return projectId;
  const fromProps = (properties?.projectId as string) || (properties?.id as string);
  if (fromProps) return fromProps;

  const byName = typeof properties?.name === 'string'
    ? DRC_PROJECTS.find((project) => project.name === properties.name)
    : null;

  return byName?.projectId || null;
}

function formatStatus(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ProjectIntelligenceHub({ projectId, properties, onBack }: ProjectIntelligenceHubProps) {
  const { startPursuit } = usePursuit();
  const resolvedProjectId = resolveProjectId(projectId, properties);
  const project = resolvedProjectId ? getDRCProjectById(resolvedProjectId) : null;

  const provinceParts = useMemo(
    () => (project ? project.location.province.split('/').map((part) => part.trim()).filter(Boolean) : []),
    [project]
  );

  const belt = useMemo(() => {
    if (!project) return null;
    return GOLD_BELTS.find((candidate) =>
      project.location.belt.toLowerCase().includes(candidate.name.toLowerCase()) ||
      candidate.name.toLowerCase().includes(project.location.belt.toLowerCase())
    ) || null;
  }, [project]);

  const regionIntel = useMemo(() => {
    if (!project) return [];
    return uniqueByKey(
      provinceParts.flatMap((province) =>
        getIntelByProvince(province).map((entry) => ({
          id: `${entry.province}-${entry.territory}`,
          ...entry,
        }))
      ),
      (entry) => entry.id
    );
  }, [project, provinceParts]);

  const hotels = useMemo(
    () => (project ? getHotelsForProject(project.projectId, provinceParts[0], project.accessInfo.nearestCity).slice(0, 8) : []),
    [project, provinceParts]
  );

  const sports = useMemo(
    () => uniqueByKey(provinceParts.flatMap((province) => getSportsByProvince(province)), (entry) => entry.id).slice(0, 8),
    [provinceParts]
  );

  const landmarks = useMemo(
    () => uniqueByKey(provinceParts.flatMap((province) => getLandmarksByProvince(province)), (entry) => entry.id).slice(0, 8),
    [provinceParts]
  );

  const governmentContacts = useMemo(
    () => uniqueByKey(provinceParts.flatMap((province) => getGovernmentByProvince(province)), (entry) => entry.id).slice(0, 10),
    [provinceParts]
  );

  const culturalRules = useMemo(
    () => uniqueByKey(provinceParts.flatMap((province) => getCultureByRegion(province)), (entry) => entry.id).slice(0, 10),
    [provinceParts]
  );

  const infrastructure = useMemo(
    () => uniqueByKey(provinceParts.flatMap((province) => getInfrastructureByProvince(province)), (entry) => entry.id).slice(0, 12),
    [provinceParts]
  );

  const sameBeltProjects = useMemo(
    () => (project ? getDRCProjectsByBelt(project.location.belt).filter((candidate) => candidate.projectId !== project.projectId) : []),
    [project]
  );

  const sameProvinceProjects = useMemo(
    () =>
      project
        ? uniqueByKey(
            provinceParts.flatMap((province) => getDRCProjectsByProvince(province)),
            (entry) => entry.projectId
          ).filter((candidate) => candidate.projectId !== project.projectId)
        : [],
    [project, provinceParts]
  );

  if (!project) {
    return (
      <div className="p-6 text-sm text-gray-400">
        Project intelligence is unavailable for this selection.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-white/10 bg-black/40 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-gold-400">
              <Sparkles size={12} />
              Project Intelligence Hub
            </div>
            <h2 className="mt-2 text-xl font-semibold text-white">{project.name}</h2>
            <p className="mt-1 text-xs text-gray-400">
              {project.operator} • {project.location.province} • {formatStatus(project.status)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 transition-colors hover:border-white/20 hover:text-white"
              >
                <ArrowLeft size={12} />
                Back
              </button>
            )}
            <button
              onClick={() => startPursuit(project.projectId)}
              className="inline-flex items-center gap-2 rounded-lg border border-gold-400/30 bg-gold-400/10 px-3 py-2 text-xs font-medium text-gold-400 transition-colors hover:bg-gold-400/20"
            >
              <Crosshair size={12} />
              Pursue This Project
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <StatCard label="Resource" value={project.totalResourceMoz ? `${project.totalResourceMoz} Moz` : 'N/A'} />
          <StatCard label="Grade" value={project.averageGrade ? `${project.averageGrade} g/t` : 'N/A'} />
          <StatCard label="Production" value={project.annualProductionKoz ? `${project.annualProductionKoz} koz` : 'N/A'} />
          <StatCard label="Nearest Hub" value={project.accessInfo.nearestCity} />
        </div>
      </div>

      <div className="p-5">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-white/5 p-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="geology">Geology</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
            <TabsTrigger value="local">Local Intel</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="government">Government</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="access">Access</TabsTrigger>
            <TabsTrigger value="asm">ASM</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Project Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <InfoBlock icon={Building2} label="Operator" value={project.operator} />
                <InfoBlock icon={Mountain} label="Deposit Type" value={project.depositType} />
                <InfoBlock icon={MapPinned} label="Mining Method" value={project.miningMethod} />
                <InfoBlock icon={Globe2} label="Primary Commodity" value={project.primaryCommodity} />
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Ownership & Permits</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  {project.owners.map((owner) => (
                    <div key={`${owner.name}-${owner.type}`} className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-gray-200">
                      <div className="font-medium">{owner.name}</div>
                      <div className="mt-1 text-xs text-gray-400">{owner.pct}% • {owner.type.replace(/_/g, ' ')}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {(project.permits.length > 0 ? project.permits : ['No permits currently listed']).map((permit) => (
                    <div key={permit} className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-gray-200">
                      {permit}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geology" className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Geology & Belt Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-gray-300">{project.geology}</p>
                {belt && (
                  <div className="rounded-xl border border-gold-400/20 bg-gold-400/5 p-4">
                    <div className="text-sm font-medium text-gold-400">{belt.name}</div>
                    <p className="mt-2 text-sm leading-6 text-gray-300">{belt.geologySummary}</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                        <div className="text-xs uppercase tracking-widest text-gray-500">Hard-Rock Model</div>
                        <p className="mt-2 text-sm text-gray-300">{belt.occurrenceModels.hardRock}</p>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                        <div className="text-xs uppercase tracking-widest text-gray-500">Alluvial Model</div>
                        <p className="mt-2 text-sm text-gray-300">{belt.occurrenceModels.alluvial}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid gap-3 md:grid-cols-2">
                  {sameBeltProjects.length > 0 ? (
                    sameBeltProjects.map((relatedProject) => (
                      <div key={relatedProject.projectId} className="rounded-lg border border-white/10 bg-black/20 p-3">
                        <div className="text-sm font-medium text-white">{relatedProject.name}</div>
                        <div className="mt-1 text-xs text-gray-400">{relatedProject.location.province} • {formatStatus(relatedProject.status)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400">No other projects are mapped to this belt yet.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Risk Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RiskBar label="Security" value={project.riskProfile.securityScore} />
                <RiskBar label="Logistics" value={project.riskProfile.logisticsScore} />
                <RiskBar label="ESG" value={project.riskProfile.esgScore} />
                <p className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-gray-300">
                  {project.riskProfile.notes}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="local" className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Local Context</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500">Languages</div>
                  <p className="mt-2 text-sm text-gray-200">{project.localContext.languages.join(', ')}</p>
                  <div className="mt-4 text-xs uppercase tracking-widest text-gray-500">Ethnic Groups</div>
                  <p className="mt-2 text-sm text-gray-200">{project.localContext.ethnicGroups.join(', ') || 'Mixed local communities'}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500">Security Level</div>
                  <p className="mt-2 text-sm font-medium text-white">{project.localContext.securityLevel.toUpperCase()}</p>
                  <p className="mt-4 text-sm leading-6 text-gray-300">{project.localContext.notes}</p>
                </div>
              </CardContent>
            </Card>

            {regionIntel.map((entry) => (
              <Card key={entry.id} className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-base text-white">{entry.province} • {entry.territory}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-widest text-gray-500">Security</div>
                    <p className="mt-2 text-sm text-white">{entry.security.level.toUpperCase()}</p>
                    <p className="mt-2 text-sm text-gray-300">{entry.security.recommendations.join(' • ')}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-widest text-gray-500">Province Explorer</div>
                    <div className="mt-2 space-y-2">
                      {sameProvinceProjects.slice(0, 4).map((candidate) => (
                        <div key={candidate.projectId} className="text-sm text-gray-200">
                          {candidate.name} <span className="text-xs text-gray-500">({formatStatus(candidate.status)})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="hotels" className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Hotels & Accommodation</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {hotels.length > 0 ? (
                  hotels.map((hotel) => (
                    <div key={hotel.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-white">{hotel.name}</div>
                        <div className="text-xs text-gold-400">{hotel.stars}★</div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">{hotel.city} • {hotel.priceRange}</div>
                      <div className="mt-2 text-sm text-gray-300">{hotel.notes}</div>
                      <div className="mt-3 text-xs text-gray-500">{hotel.amenities.join(' • ')}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400">No accommodation profile is mapped for this project yet.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="government" className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Government & Regional Intel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {governmentContacts.map((contact) => (
                  <div key={contact.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <div className="text-sm font-medium text-white">{contact.office}</div>
                    <div className="mt-1 text-xs text-gold-400">{contact.officeholder}</div>
                    <div className="mt-2 text-sm text-gray-300">{contact.jurisdiction}</div>
                    <div className="mt-2 text-xs text-gray-500">{contact.contactInfo}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Infrastructure, Hospitals & Utilities</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {infrastructure.map((item) => (
                  <div key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-widest text-gray-500">{item.type}</div>
                    <div className="mt-2 text-sm font-medium text-white">{item.name}</div>
                    <div className="mt-1 text-xs text-gray-400">{item.city}, {item.province}</div>
                    <div className="mt-2 text-sm text-gray-300">{item.details}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="culture" className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Cultural Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {culturalRules.map((rule) => (
                  <div key={rule.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-white">{rule.rule}</div>
                      <div className="text-[10px] uppercase tracking-widest text-gold-400">{rule.importanceLevel}</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">{rule.category} • {rule.region}</div>
                    <div className="mt-2 text-sm text-gray-300">{rule.notes}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sports" className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Sports & Culture Pulse</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {sports.map((club) => (
                  <div key={club.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <div className="text-sm font-medium text-white">{club.name}</div>
                    <div className="mt-1 text-xs text-gray-400">{club.city} • {club.league}</div>
                    <div className="mt-2 text-sm text-gray-300">{club.notableFacts.join(' • ')}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Landmarks & Sites</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {landmarks.map((landmark) => (
                  <div key={landmark.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <div className="text-sm font-medium text-white">{landmark.name}</div>
                    <div className="mt-1 text-xs text-gray-400">{landmark.type} • {landmark.province}</div>
                    <div className="mt-2 text-sm text-gray-300">{landmark.significance}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Access & Logistics</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500">Ground Access</div>
                  <p className="mt-2 text-sm text-gray-200">Nearest city: {project.accessInfo.nearestCity}</p>
                  <p className="mt-1 text-sm text-gray-200">Distance: {project.accessInfo.distanceKm ? `${project.accessInfo.distanceKm} km` : 'N/A'}</p>
                  <p className="mt-1 text-sm text-gray-200">Road: {project.accessInfo.roadCondition}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500">Air & Support</div>
                  <p className="mt-2 text-sm text-gray-200">Airstrip: {project.accessInfo.airstrip ? 'Available' : 'No dedicated airstrip'}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-300">{project.accessInfo.logisticsNotes}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="asm" className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Artisanal Mining Overlay</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500">ASM Presence</div>
                  <p className="mt-2 text-sm text-white">{project.artisanalOverlay.present ? 'Active' : 'Not currently mapped'}</p>
                  <p className="mt-1 text-sm text-gray-300">Scale: {project.artisanalOverlay.scale}</p>
                  {project.artisanalOverlay.estimatedMiners && (
                    <p className="mt-1 text-sm text-gray-300">Estimated miners: {project.artisanalOverlay.estimatedMiners.toLocaleString()}</p>
                  )}
                </div>
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500">Assessment</div>
                  <p className="mt-2 text-sm leading-6 text-gray-300">{project.artisanalOverlay.notes || 'No additional ASM notes.'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Recent Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.recentActivity.length > 0 ? (
                  project.recentActivity.map((activity, index) => (
                    <div key={`${activity.date}-${index}`} className="rounded-lg border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-widest text-gold-400">{activity.date}</div>
                      <div className="mt-2 text-sm font-medium text-white">{formatStatus(activity.type)}</div>
                      <div className="mt-2 text-sm text-gray-300">{activity.summary}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400">No recent activity is currently logged for this project.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">{label}</div>
      <div className="mt-2 text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function InfoBlock({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
        <Icon size={12} />
        {label}
      </div>
      <div className="mt-2 text-sm text-gray-200">{value}</div>
    </div>
  );
}

function RiskBar({ label, value }: { label: string; value: number | null }) {
  const safeValue = value ?? 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-white">{value ?? 'N/A'}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400"
          style={{ width: `${Math.min(100, Math.max(0, safeValue))}%` }}
        />
      </div>
    </div>
  );
}
