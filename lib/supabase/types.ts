// Tipos gerados manualmente a partir de `supabase/migrations`.
// Quando o Supabase CLI estiver disponível, substituir por:
//   npx supabase gen types typescript --local > lib/supabase/types.ts

export type Objetivo = "ganho" | "perda";
export type DiaSemana =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado"
  | "domingo";
export type StatusSessao = "completo" | "parcial" | "nao_realizado";
export type TipoTemporada = "semanal" | "trimestral";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome: string;
          idade: number | null;
          telefone: string | null;
          academia: string | null;
          instrutor: string | null;
          avatar_url: string | null;
          altura_cm: number | null;
          peso_inicial_kg: number | null;
          data_inicio: string | null;
          objetivo: Objetivo | null;
          criado_em: string;
        };
        Insert: {
          id: string;
          nome: string;
          idade?: number | null;
          telefone?: string | null;
          academia?: string | null;
          instrutor?: string | null;
          avatar_url?: string | null;
          altura_cm?: number | null;
          peso_inicial_kg?: number | null;
          data_inicio?: string | null;
          objetivo?: Objetivo | null;
          criado_em?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          nome: string;
          grupo_muscular: string | null;
          gif_url: string | null;
          criado_em: string;
        };
        Insert: {
          id?: string;
          nome: string;
          grupo_muscular?: string | null;
          gif_url?: string | null;
          criado_em?: string;
        };
        Update: Partial<Database["public"]["Tables"]["exercises"]["Insert"]>;
        Relationships: [];
      };
      workout_templates: {
        Row: {
          id: string;
          nome: string;
          criado_por: string | null;
          criado_em: string;
          dia_semana: DiaSemana | null;
        };
        Insert: {
          id?: string;
          nome: string;
          criado_por?: string | null;
          criado_em?: string;
          dia_semana?: DiaSemana | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["workout_templates"]["Insert"]
        >;
        Relationships: [];
      };
      template_exercises: {
        Row: {
          id: string;
          template_id: string;
          exercise_id: string;
          series: number;
          rep_min: number;
          rep_max: number;
          ordem: number;
        };
        Insert: {
          id?: string;
          template_id: string;
          exercise_id: string;
          series: number;
          rep_min: number;
          rep_max: number;
          ordem?: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["template_exercises"]["Insert"]
        >;
        Relationships: [];
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          template_id: string | null;
          data: string;
          status: StatusSessao;
          criado_em: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id?: string | null;
          data: string;
          status?: StatusSessao;
          criado_em?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sessions"]["Insert"]>;
        Relationships: [];
      };
      session_sets: {
        Row: {
          id: string;
          session_id: string;
          exercise_id: string;
          serie_num: number;
          carga_kg: number | null;
          reps: number | null;
          concluida: boolean;
        };
        Insert: {
          id?: string;
          session_id: string;
          exercise_id: string;
          serie_num: number;
          carga_kg?: number | null;
          reps?: number | null;
          concluida?: boolean;
        };
        Update: Partial<
          Database["public"]["Tables"]["session_sets"]["Insert"]
        >;
        Relationships: [];
      };
      body_logs: {
        Row: {
          id: string;
          user_id: string;
          data: string;
          semana: string;
          peso_kg: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          data: string;
          semana: string;
          peso_kg: number;
        };
        Update: Partial<Database["public"]["Tables"]["body_logs"]["Insert"]>;
        Relationships: [];
      };
      seasons: {
        Row: {
          id: string;
          tipo: TipoTemporada;
          data_inicio: string;
          data_fim: string;
          encerrada: boolean;
        };
        Insert: {
          id?: string;
          tipo: TipoTemporada;
          data_inicio: string;
          data_fim: string;
          encerrada?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["seasons"]["Insert"]>;
        Relationships: [];
      };
      season_entries: {
        Row: {
          id: string;
          season_id: string;
          user_id: string;
          pontos: number;
          colocacao_final: number | null;
        };
        Insert: {
          id?: string;
          season_id: string;
          user_id: string;
          pontos?: number;
          colocacao_final?: number | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["season_entries"]["Insert"]
        >;
        Relationships: [];
      };
      race_optins: {
        Row: {
          id: string;
          user_id: string;
          ativo: boolean;
          criado_em: string;
          ativo_desde: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          ativo?: boolean;
          criado_em?: string;
          ativo_desde?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["race_optins"]["Insert"]
        >;
        Relationships: [];
      };
      diet_plans: {
        Row: {
          id: string;
          user_id: string;
          objetivo: Objetivo;
          descricao: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          objetivo: Objetivo;
          descricao?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["diet_plans"]["Insert"]>;
        Relationships: [];
      };
      diet_checkins: {
        Row: {
          id: string;
          user_id: string;
          data: string;
          cumpriu: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          data: string;
          cumpriu: boolean;
        };
        Update: Partial<
          Database["public"]["Tables"]["diet_checkins"]["Insert"]
        >;
        Relationships: [];
      };
      bioimpedancia_logs: {
        Row: {
          id: string;
          user_id: string;
          data: string;
          peso_kg: number | null;
          percentual_gordura: number | null;
          massa_magra_kg: number | null;
          massa_muscular_kg: number | null;
          agua_corporal_pct: number | null;
          massa_ossea_kg: number | null;
          gordura_visceral: number | null;
          taxa_metabolica_basal: number | null;
          idade_metabolica: number | null;
          pescoco_cm: number | null;
          peito_cm: number | null;
          cintura_cm: number | null;
          abdomen_cm: number | null;
          quadril_cm: number | null;
          coxa_direita_cm: number | null;
          coxa_esquerda_cm: number | null;
          panturrilha_direita_cm: number | null;
          panturrilha_esquerda_cm: number | null;
          braco_contraido_direito_cm: number | null;
          braco_contraido_esquerdo_cm: number | null;
          braco_relaxado_direito_cm: number | null;
          braco_relaxado_esquerdo_cm: number | null;
          criado_em: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          data?: string;
          peso_kg?: number | null;
          percentual_gordura?: number | null;
          massa_magra_kg?: number | null;
          massa_muscular_kg?: number | null;
          agua_corporal_pct?: number | null;
          massa_ossea_kg?: number | null;
          gordura_visceral?: number | null;
          taxa_metabolica_basal?: number | null;
          idade_metabolica?: number | null;
          pescoco_cm?: number | null;
          peito_cm?: number | null;
          cintura_cm?: number | null;
          abdomen_cm?: number | null;
          quadril_cm?: number | null;
          coxa_direita_cm?: number | null;
          coxa_esquerda_cm?: number | null;
          panturrilha_direita_cm?: number | null;
          panturrilha_esquerda_cm?: number | null;
          braco_contraido_direito_cm?: number | null;
          braco_contraido_esquerdo_cm?: number | null;
          braco_relaxado_direito_cm?: number | null;
          braco_relaxado_esquerdo_cm?: number | null;
          criado_em?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["bioimpedancia_logs"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: {
      public_ranking: {
        Row: {
          season_id: string;
          user_id: string;
          nome: string;
          avatar_url: string | null;
          pontos: number;
          colocacao_final: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      ranking_semana_atual: {
        Args: Record<string, never>;
        Returns: {
          user_id: string;
          nome: string;
          avatar_url: string | null;
          treinos_concluidos: number;
          variacao_volume: number;
          pontos: number;
        }[];
      };
    };
  };
}
