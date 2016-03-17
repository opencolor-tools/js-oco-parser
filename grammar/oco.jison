
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
  | metadata
  { $$ = $1;  }
  ;

metadata
  : metaname ':' NAME newlines
  { $$ = new yy.Metadata($1, $3); }
  ;

metaname
  : '/' NAME
  { $$ = '/' + $2 }
  | NAME '/' NAME
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
