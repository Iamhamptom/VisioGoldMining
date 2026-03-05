import { createHash } from 'crypto';

export interface NormalizationResult {
  checksum: string;
  parserVersion: string;
  normalizedSchema: Record<string, unknown>;
  summary: Record<string, unknown>;
  status: 'completed' | 'needs_review';
}

function detectDelimiter(content: string): ',' | ';' | '\t' {
  const comma = (content.match(/,/g) || []).length;
  const semicolon = (content.match(/;/g) || []).length;
  const tab = (content.match(/\t/g) || []).length;

  if (tab >= comma && tab >= semicolon) return '\t';
  if (semicolon >= comma) return ';';
  return ',';
}

function normalizeCsv(buffer: Buffer, filename: string): NormalizationResult {
  const text = buffer.toString('utf8');
  const lines = text.split(/\r?\n/).filter(Boolean);
  const delimiter = detectDelimiter(text);
  const headers = (lines[0] || '').split(delimiter).map((h) => h.trim());

  const rowCount = Math.max(0, lines.length - 1);
  const schema = headers.map((column) => ({
    column,
    inferred_type: /lat|lon|x|y|depth|grade|ppm|gpt|meter|cost|score/i.test(column) ? 'number_like' : 'string_like',
  }));

  return {
    checksum: createHash('sha256').update(buffer).digest('hex'),
    parserVersion: 'vg-ingest-1.0',
    normalizedSchema: {
      format: 'tabular',
      filename,
      delimiter,
      columns: schema,
    },
    summary: {
      rows: rowCount,
      columns: headers.length,
      sample_headers: headers.slice(0, 10),
    },
    status: rowCount > 0 ? 'completed' : 'needs_review',
  };
}

function normalizeGeoJson(buffer: Buffer, filename: string): NormalizationResult {
  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(buffer.toString('utf8')) as Record<string, unknown>;
  } catch {
    parsed = null;
  }

  const features = Array.isArray((parsed as { features?: unknown[] } | null)?.features)
    ? ((parsed as { features: unknown[] }).features)
    : [];

  const geometryTypes = Array.from(new Set(
    features
      .map((f) => (f as { geometry?: { type?: string } })?.geometry?.type)
      .filter((t): t is string => Boolean(t))
  ));

  return {
    checksum: createHash('sha256').update(buffer).digest('hex'),
    parserVersion: 'vg-ingest-1.0',
    normalizedSchema: {
      format: 'geojson',
      filename,
      feature_count: features.length,
      geometry_types: geometryTypes,
      crs: 'WGS84_or_unknown',
    },
    summary: {
      feature_count: features.length,
      geometry_types: geometryTypes,
    },
    status: features.length > 0 ? 'completed' : 'needs_review',
  };
}

function normalizeBinary(buffer: Buffer, filename: string, dataType: string): NormalizationResult {
  return {
    checksum: createHash('sha256').update(buffer).digest('hex'),
    parserVersion: 'vg-ingest-1.0',
    normalizedSchema: {
      format: dataType,
      filename,
      size_bytes: buffer.length,
      parse_mode: 'metadata_only',
    },
    summary: {
      size_bytes: buffer.length,
      note: 'Metadata extracted. Manual review may be required for deep parsing.',
    },
    status: 'needs_review',
  };
}

export function normalizeAsset(buffer: Buffer, filename: string, dataType: string): NormalizationResult {
  const lower = filename.toLowerCase();

  if (dataType === 'csv' || dataType === 'assay_table' || dataType === 'drillhole_table' || lower.endsWith('.csv') || lower.endsWith('.tsv')) {
    return normalizeCsv(buffer, filename);
  }

  if (dataType === 'geojson' || lower.endsWith('.geojson') || lower.endsWith('.json')) {
    return normalizeGeoJson(buffer, filename);
  }

  return normalizeBinary(buffer, filename, dataType);
}
