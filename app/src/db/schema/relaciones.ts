import { relations } from "drizzle-orm";
import { organizaciones } from "./organizaciones";
import { usuarios, sesiones, cuentasOAuth } from "./usuarios";
import { indicadores, mediciones } from "./indicadores";
import { documentos, fragmentosDocumento } from "./documentos";
import { informes } from "./informes";
import { auditoria } from "./auditoria";

export const organizacionesRelations = relations(organizaciones, ({ many }) => ({
  usuarios: many(usuarios),
  indicadores: many(indicadores),
  documentos: many(documentos),
  informes: many(informes),
  auditoria: many(auditoria),
}));

export const usuariosRelations = relations(usuarios, ({ one, many }) => ({
  organizacion: one(organizaciones, {
    fields: [usuarios.organizacionId],
    references: [organizaciones.id],
  }),
  sesiones: many(sesiones),
  cuentasOAuth: many(cuentasOAuth),
}));

export const sesionesRelations = relations(sesiones, ({ one }) => ({
  usuario: one(usuarios, { fields: [sesiones.usuarioId], references: [usuarios.id] }),
}));

export const cuentasOAuthRelations = relations(cuentasOAuth, ({ one }) => ({
  usuario: one(usuarios, { fields: [cuentasOAuth.usuarioId], references: [usuarios.id] }),
}));

export const indicadoresRelations = relations(indicadores, ({ one, many }) => ({
  organizacion: one(organizaciones, {
    fields: [indicadores.organizacionId],
    references: [organizaciones.id],
  }),
  mediciones: many(mediciones),
}));

export const medicionesRelations = relations(mediciones, ({ one }) => ({
  indicador: one(indicadores, { fields: [mediciones.indicadorId], references: [indicadores.id] }),
  cargadoPor: one(usuarios, { fields: [mediciones.cargadoPorId], references: [usuarios.id] }),
}));

export const documentosRelations = relations(documentos, ({ one, many }) => ({
  organizacion: one(organizaciones, {
    fields: [documentos.organizacionId],
    references: [organizaciones.id],
  }),
  fragmentos: many(fragmentosDocumento),
}));

export const fragmentosDocumentoRelations = relations(fragmentosDocumento, ({ one }) => ({
  documento: one(documentos, {
    fields: [fragmentosDocumento.documentoId],
    references: [documentos.id],
  }),
}));

export const informesRelations = relations(informes, ({ one }) => ({
  organizacion: one(organizaciones, {
    fields: [informes.organizacionId],
    references: [organizaciones.id],
  }),
  generadoPor: one(usuarios, { fields: [informes.generadoPorId], references: [usuarios.id] }),
}));

export const auditoriaRelations = relations(auditoria, ({ one }) => ({
  organizacion: one(organizaciones, {
    fields: [auditoria.organizacionId],
    references: [organizaciones.id],
  }),
  usuario: one(usuarios, { fields: [auditoria.usuarioId], references: [usuarios.id] }),
}));
