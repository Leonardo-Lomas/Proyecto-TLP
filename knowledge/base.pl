% ============================
% Base de conocimiento ejemplo
% ============================

% Hechos: contratos
contract(contract1).
contract(contract2).
contract(contract3).

% Hechos: penalidades aplicables
penalty_applicable(contract1).

% Hechos: clientes
client(alice).
client(bob).
client(charlie).

% Relación cliente-contrato
owns(alice, contract1).
owns(bob, contract2).
owns(charlie, contract3).

% Reglas: contrato válido si existe y no tiene penalidad
valid_contract(X) :- contract(X), \+ penalty_applicable(X).

% Reglas: cliente válido si posee contrato válido
valid_client(C) :- client(C), owns(C, X), valid_contract(X).

% Reglas: cliente penalizado si posee contrato con penalidad
penalized_client(C) :- client(C), owns(C, X), penalty_applicable(X).
