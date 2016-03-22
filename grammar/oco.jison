
%start expressions

%%

expressions

  : entries EOF
  {  return new yy.Palette('root', $1) }
  ;

entries
  : entry
  { $$ = [ $1 ]}
  | entries entry
  { $$ = $1; $1.push($2); }
  ;

entry
  : NAME ':' NEWLINE block
  { $$ = new yy.Palette($1, $4); }
  | NAME ':' colorvalue
  { $$ = new yy.Color($1, $3) }
  | NAME ':' reference
  { $$ = new yy.Reference($1, $3)}
  | metadata
  { $$ = $1;  }
  ;

reference
  : '=' referenceNames newlines
  { $$ = $2; }
  ;

referenceNames
  : NAME
  { $$ = yytext; }
  | NAME '.' referenceNames
  { $$ = $1 + '.' + $3 }
  ;

metadata
  : metanames ':' NAME newlines
  { $$ = new yy.Metadata($1, $3); }
  ;

metanames
  : '/' NAME
  { $$ = '/' + $2 }
  | NAME '/' NAME
  { $$ = $1 + '/' + $3 }
  | '/' NAME '/' metanames
  { $$ = '/' + $2 + '/' + $4 }
  | NAME '/' metanames
  { $$ = $1 + '/' + $3 }
  ;

newlines
  : NEWLINE
  | NEWLINE newlines
  ;

block
  : INDENT entries OUTDENT
  { $$ = $2 }
  ;

colorvalues
  : colorvalue
  ;

hexnum
  : HEXNUMBER
  { $$ = yytext; }
  ;

colorvalue
  : '#' hexnum newlines
  { $$ = '#' + $2; }
  | '#' NUMBER newlines
  { $$ = '#' + $2; }
  ;
