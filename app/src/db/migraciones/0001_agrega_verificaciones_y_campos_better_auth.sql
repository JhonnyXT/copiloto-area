CREATE TABLE "verificaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identificador" text NOT NULL,
	"valor" text NOT NULL,
	"expira_en" timestamp with time zone NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cuentas_oauth" ADD COLUMN "token_id" text;--> statement-breakpoint
ALTER TABLE "cuentas_oauth" ADD COLUMN "token_refresco_expira_en" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "cuentas_oauth" ADD COLUMN "alcance" text;--> statement-breakpoint
ALTER TABLE "cuentas_oauth" ADD COLUMN "clave" text;--> statement-breakpoint
ALTER TABLE "cuentas_oauth" ADD COLUMN "actualizado_en" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sesiones" ADD COLUMN "actualizado_en" timestamp with time zone DEFAULT now() NOT NULL;