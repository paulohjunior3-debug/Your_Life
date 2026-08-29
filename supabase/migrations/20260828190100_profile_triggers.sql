-- Cria automaticamente uma linha em `profiles` quando um usuário se cadastra
-- via Supabase Auth, usando os metadados enviados no signUp (`nome`).
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', 'Sem nome'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- `peso_inicial_kg` só pode ser editado nas primeiras 48h após o cadastro
-- (ver ESPECIFICACAO.md seção 4): corrige erro de digitação honesto sem
-- abrir brecha para reescrever a linha de base depois de já ter progredido.
create function enforce_peso_inicial_lock()
returns trigger
language plpgsql
as $$
begin
  if new.peso_inicial_kg is distinct from old.peso_inicial_kg
     and now() - old.criado_em > interval '48 hours' then
    raise exception 'peso_inicial_kg não pode mais ser editado (prazo de 48h expirado)';
  end if;
  return new;
end;
$$;

create trigger profiles_peso_inicial_lock
  before update on profiles
  for each row execute function enforce_peso_inicial_lock();
