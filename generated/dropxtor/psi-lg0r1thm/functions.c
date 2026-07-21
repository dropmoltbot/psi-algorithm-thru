#include <stdint.h> /* for uint8_t, int64_t, etc. */
#include <stddef.h> /* for offsetof */
#include <stdlib.h> /* for malloc */
#include <string.h> /* for memcpy */
#include <assert.h> /* for assert */
#include <stdio.h> /* for fprintf */
#include "types.h" /* for type definitions */

/* Checked arithmetic helpers */
static inline int tn_checked_add_u64( uint64_t a,
uint64_t b,
uint64_t * out ) {
if( !out ) return 1;
if( a > UINT64_MAX - b ) return 1;
*out = a + b;
return 0;
}

static inline int tn_checked_mul_u64( uint64_t a,
uint64_t b,
uint64_t * out ) {
if( !out ) return 1;
if( a && b > UINT64_MAX / a ) return 1;
*out = a * b;
return 0;
}

/*  ----- FUNCTIONS FOR BlsVerifyPayload ----- */

uint64_t BlsVerifyPayload_footprint( int64_t msg_len ) {
  return BlsVerifyPayload_footprint_ir( (uint64_t)msg_len );
}

/* IR footprint generated for BlsVerifyPayload */
uint64_t BlsVerifyPayload_footprint_ir( uint64_t message_msg_len ) {
    return (((((((((96ULL) + 1ULL - 1ULL) & ~(1ULL - 1ULL)) + (((96ULL) + 1ULL - 1ULL) & ~(1ULL - 1ULL))) + (((2ULL) + 2ULL - 1ULL) & ~(2ULL - 1ULL))) + ((((message_msg_len * 1ULL)) + 1ULL - 1ULL) & ~(1ULL - 1ULL)))) + 1ULL - 1ULL) & ~(1ULL - 1ULL));
}
/* IR validator generated for BlsVerifyPayload */
int BlsVerifyPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t message_msg_len ) {
  uint64_t tn_val_0 = 96ULL;
  uint64_t tn_val_1 = 96ULL;
  uint64_t tn_val_2 = 0ULL;
  if( tn_checked_add_u64( tn_val_0, tn_val_1, &tn_val_2 ) ) return 3;
  uint64_t tn_val_3 = 2ULL;
  uint64_t tn_val_4 = tn_val_3;
  uint64_t tn_val_5 = tn_val_4 % 2ULL;
  if( tn_val_5 ) {
    uint64_t tn_val_6 = 2ULL - tn_val_5;
    if( tn_checked_add_u64( tn_val_4, tn_val_6, &tn_val_4 ) ) return 3;
  }
  uint64_t tn_val_7 = 0ULL;
  if( tn_checked_add_u64( tn_val_2, tn_val_4, &tn_val_7 ) ) return 3;
  uint64_t tn_val_8 = 1ULL;
  uint64_t tn_val_9 = 0ULL;
  if( tn_checked_mul_u64( message_msg_len, tn_val_8, &tn_val_9 ) ) return 3;
  uint64_t tn_val_10 = 0ULL;
  if( tn_checked_add_u64( tn_val_7, tn_val_9, &tn_val_10 ) ) return 3;
  if( tn_val_10 > buf_sz ) return 1;
  if( out_bytes_consumed ) *out_bytes_consumed = tn_val_10;
  return 0;
}

BlsVerifyPayload_t const * BlsVerifyPayload_from_slice( uint8_t const * data, uint64_t data_len ) {
    uint64_t required_size;
    if( BlsVerifyPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (BlsVerifyPayload_t const *)data;
}

BlsVerifyPayload_t * BlsVerifyPayload_from_slice_mut( uint8_t * data, uint64_t data_len ) {
    uint64_t required_size;
    if( BlsVerifyPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (BlsVerifyPayload_t *)data;
}

int BlsVerifyPayload_new( uint8_t * buffer, uint64_t buffer_size, uint16_t msg_len, uint64_t * out_size ) {
    uint64_t required_size = 0;
    required_size += 96; /* pubkey (array) */
    required_size += 96; /* signature (array) */
    required_size += 2; /* msg_len */
    required_size += (msg_len) * 1; /* message (variable array) */

    if( buffer_size < required_size ) {
        return -1; /* Buffer too small */
    }

    memset( buffer, 0, required_size );

    uint64_t offset = 0;

    offset += 96; /* skip array 'pubkey' (set via setters) */

    offset += 96; /* skip array 'signature' (set via setters) */

    memcpy( &buffer[offset], &msg_len, sizeof( msg_len ) );
    offset += 2;

    offset += (msg_len) * 1; /* skip variable array 'message' (set via setters) */

    *out_size = required_size;
    return 0; /* Success */
}

/* Array accessor helpers for pubkey */
uint64_t BlsVerifyPayload_get_pubkey_length( BlsVerifyPayload_t const * self ) {
    return 96;
}

uint8_t BlsVerifyPayload_get_pubkey_at( BlsVerifyPayload_t const * self, uint64_t index ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = index * 1;
    return data[offset];
}

/* Array accessor helpers for signature */
uint64_t BlsVerifyPayload_get_signature_length( BlsVerifyPayload_t const * self ) {
    return 96;
}

uint8_t BlsVerifyPayload_get_signature_at( BlsVerifyPayload_t const * self, uint64_t index ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 96; /* pubkey (array) */
    offset += index * 1; /* element index */
    return data[offset];
}

uint16_t BlsVerifyPayload_get_msg_len( BlsVerifyPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 96; /* pubkey (array) */
    offset += 96; /* signature (array) */
    return ({ uint16_t val; memcpy( &val, &data[offset], sizeof( val ) ); val; });
}

/* Variable-size array accessor helpers for message */
uint64_t BlsVerifyPayload_get_message_length( BlsVerifyPayload_t const * self ) {
    return (BlsVerifyPayload_get_msg_len( self ));
}

uint8_t BlsVerifyPayload_get_message_at( BlsVerifyPayload_t const * self, uint64_t index ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t base_offset = 0;
    base_offset += 96; /* pubkey (array) */
    base_offset += 96; /* signature (array) */
    base_offset += 2; /* msg_len */
    uint64_t offset = base_offset + index * 1; /* element index */
    return data[offset];
}

uint8_t const * BlsVerifyPayload_get_message_const( BlsVerifyPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 96; /* pubkey (array) */
    offset += 96; /* signature (array) */
    offset += 2; /* msg_len */
    return &data[offset];
}

void BlsVerifyPayload_set_pubkey_at( BlsVerifyPayload_t * self, uint64_t index, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = index * 1;
    data[offset] = value;
}

void BlsVerifyPayload_set_signature_at( BlsVerifyPayload_t * self, uint64_t index, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 96; /* pubkey (array) */
    offset += index * 1; /* element index */
    data[offset] = value;
}

void BlsVerifyPayload_set_msg_len( BlsVerifyPayload_t * self, uint16_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 96; /* pubkey (array) */
    offset += 96; /* signature (array) */
    memcpy( &data[offset], &value, sizeof( value ) );
}

void BlsVerifyPayload_set_message_at( BlsVerifyPayload_t * self, uint64_t index, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t base_offset = 0;
    base_offset += 96; /* pubkey (array) */
    base_offset += 96; /* signature (array) */
    base_offset += 2; /* msg_len */
    uint64_t offset = base_offset + index * 1;
    data[offset] = value;
}

void BlsVerifyPayload_set_message( uint8_t * data, uint8_t const * slice, uint64_t slice_len ) {
    uint64_t offset = 0;
    offset += 96; /* pubkey (array) */
    offset += 96; /* signature (array) */
    offset += 2; /* msg_len */
    uint64_t len = BlsVerifyPayload_get_message_length( (BlsVerifyPayload_t const *)data );
    if( slice_len < len ) len = slice_len;
    memcpy( &data[offset], slice, len );
}

uint8_t * BlsVerifyPayload_get_message( uint8_t * data ) {
    uint64_t offset = 0;
    offset += 96; /* pubkey (array) */
    offset += 96; /* signature (array) */
    offset += 2; /* msg_len */
    return &data[offset];
}

int BlsVerifyPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size ) {
    uint64_t offset = 0;

    if( offset + 96 > data_len ) {
        return -1; /* Buffer too small for array 'pubkey' */
    }
    offset += 96; /* pubkey (array) */

    if( offset + 96 > data_len ) {
        return -1; /* Buffer too small for array 'signature' */
    }
    offset += 96; /* signature (array) */

    if( offset + 2 > data_len ) {
        return -1; /* Buffer too small for 'msg_len' */
    }
    uint64_t offset_msg_len = offset;
    offset += 2; /* msg_len */

    *out_size = offset;
    return 0;
}

/*  ----- FUNCTIONS FOR EventPayload ----- */

uint64_t EventPayload_footprint( int64_t data_len ) {
  return EventPayload_footprint_ir( (uint64_t)data_len );
}

/* IR footprint generated for EventPayload */
uint64_t EventPayload_footprint_ir( uint64_t data_data_len ) {
    return ((((((((1ULL) + 1ULL - 1ULL) & ~(1ULL - 1ULL)) + (((2ULL) + 2ULL - 1ULL) & ~(2ULL - 1ULL))) + ((((data_data_len * 1ULL)) + 1ULL - 1ULL) & ~(1ULL - 1ULL)))) + 1ULL - 1ULL) & ~(1ULL - 1ULL));
}
/* IR validator generated for EventPayload */
int EventPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t data_data_len ) {
  uint64_t tn_val_0 = 1ULL;
  uint64_t tn_val_1 = 2ULL;
  uint64_t tn_val_2 = tn_val_1;
  uint64_t tn_val_3 = tn_val_2 % 2ULL;
  if( tn_val_3 ) {
    uint64_t tn_val_4 = 2ULL - tn_val_3;
    if( tn_checked_add_u64( tn_val_2, tn_val_4, &tn_val_2 ) ) return 3;
  }
  uint64_t tn_val_5 = 0ULL;
  if( tn_checked_add_u64( tn_val_0, tn_val_2, &tn_val_5 ) ) return 3;
  uint64_t tn_val_6 = 1ULL;
  uint64_t tn_val_7 = 0ULL;
  if( tn_checked_mul_u64( data_data_len, tn_val_6, &tn_val_7 ) ) return 3;
  uint64_t tn_val_8 = 0ULL;
  if( tn_checked_add_u64( tn_val_5, tn_val_7, &tn_val_8 ) ) return 3;
  if( tn_val_8 > buf_sz ) return 1;
  if( out_bytes_consumed ) *out_bytes_consumed = tn_val_8;
  return 0;
}

EventPayload_t const * EventPayload_from_slice( uint8_t const * data, uint64_t data_len ) {
    uint64_t required_size;
    if( EventPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (EventPayload_t const *)data;
}

EventPayload_t * EventPayload_from_slice_mut( uint8_t * data, uint64_t data_len ) {
    uint64_t required_size;
    if( EventPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (EventPayload_t *)data;
}

int EventPayload_new( uint8_t * buffer, uint64_t buffer_size, uint16_t data_len, uint64_t * out_size ) {
    uint64_t required_size = 0;
    required_size += 1; /* event_type */
    required_size += 2; /* data_len */
    required_size += (data_len) * 1; /* data (variable array) */

    if( buffer_size < required_size ) {
        return -1; /* Buffer too small */
    }

    memset( buffer, 0, required_size );

    uint64_t offset = 0;

    offset += 1;

    memcpy( &buffer[offset], &data_len, sizeof( data_len ) );
    offset += 2;

    offset += (data_len) * 1; /* skip variable array 'data' (set via setters) */

    *out_size = required_size;
    return 0; /* Success */
}

uint8_t EventPayload_get_event_type( EventPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    return data[0];
}

uint16_t EventPayload_get_data_len( EventPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 1; /* event_type */
    return ({ uint16_t val; memcpy( &val, &data[offset], sizeof( val ) ); val; });
}

/* Variable-size array accessor helpers for data */
uint64_t EventPayload_get_data_length( EventPayload_t const * self ) {
    return (EventPayload_get_data_len( self ));
}

uint8_t EventPayload_get_data_at( EventPayload_t const * self, uint64_t index ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t base_offset = 0;
    base_offset += 1; /* event_type */
    base_offset += 2; /* data_len */
    uint64_t offset = base_offset + index * 1; /* element index */
    return data[offset];
}

uint8_t const * EventPayload_get_data_const( EventPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 1; /* event_type */
    offset += 2; /* data_len */
    return &data[offset];
}

void EventPayload_set_event_type( EventPayload_t * self, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    data[0] = value;
}

void EventPayload_set_data_len( EventPayload_t * self, uint16_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 1; /* event_type */
    memcpy( &data[offset], &value, sizeof( value ) );
}

void EventPayload_set_data_at( EventPayload_t * self, uint64_t index, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t base_offset = 0;
    base_offset += 1; /* event_type */
    base_offset += 2; /* data_len */
    uint64_t offset = base_offset + index * 1;
    data[offset] = value;
}

void EventPayload_set_data( uint8_t * data, uint8_t const * slice, uint64_t slice_len ) {
    uint64_t offset = 0;
    offset += 1; /* event_type */
    offset += 2; /* data_len */
    uint64_t len = EventPayload_get_data_length( (EventPayload_t const *)data );
    if( slice_len < len ) len = slice_len;
    memcpy( &data[offset], slice, len );
}

uint8_t * EventPayload_get_data( uint8_t * data ) {
    uint64_t offset = 0;
    offset += 1; /* event_type */
    offset += 2; /* data_len */
    return &data[offset];
}

int EventPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size ) {
    uint64_t offset = 0;

    if( offset + 1 > data_len ) {
        return -1; /* Buffer too small for 'event_type' */
    }
    offset += 1; /* event_type */

    if( offset + 2 > data_len ) {
        return -1; /* Buffer too small for 'data_len' */
    }
    uint64_t offset_data_len = offset;
    offset += 2; /* data_len */

    *out_size = offset;
    return 0;
}

/*  ----- FUNCTIONS FOR Instruction ----- */

uint64_t Instruction_footprint( int64_t data_len ) {
  return Instruction_footprint_ir( (uint64_t)data_len );
}

/* IR footprint generated for Instruction */
uint64_t Instruction_footprint_ir( uint64_t data_data_len ) {
    return ((((((((1ULL) + 1ULL - 1ULL) & ~(1ULL - 1ULL)) + (((2ULL) + 2ULL - 1ULL) & ~(2ULL - 1ULL))) + ((((data_data_len * 1ULL)) + 1ULL - 1ULL) & ~(1ULL - 1ULL)))) + 1ULL - 1ULL) & ~(1ULL - 1ULL));
}
/* IR validator generated for Instruction */
int Instruction_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t data_data_len ) {
  uint64_t tn_val_0 = 1ULL;
  uint64_t tn_val_1 = 2ULL;
  uint64_t tn_val_2 = tn_val_1;
  uint64_t tn_val_3 = tn_val_2 % 2ULL;
  if( tn_val_3 ) {
    uint64_t tn_val_4 = 2ULL - tn_val_3;
    if( tn_checked_add_u64( tn_val_2, tn_val_4, &tn_val_2 ) ) return 3;
  }
  uint64_t tn_val_5 = 0ULL;
  if( tn_checked_add_u64( tn_val_0, tn_val_2, &tn_val_5 ) ) return 3;
  uint64_t tn_val_6 = 1ULL;
  uint64_t tn_val_7 = 0ULL;
  if( tn_checked_mul_u64( data_data_len, tn_val_6, &tn_val_7 ) ) return 3;
  uint64_t tn_val_8 = 0ULL;
  if( tn_checked_add_u64( tn_val_5, tn_val_7, &tn_val_8 ) ) return 3;
  if( tn_val_8 > buf_sz ) return 1;
  if( out_bytes_consumed ) *out_bytes_consumed = tn_val_8;
  return 0;
}

Instruction_t const * Instruction_from_slice( uint8_t const * data, uint64_t data_len ) {
    uint64_t required_size;
    if( Instruction_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (Instruction_t const *)data;
}

Instruction_t * Instruction_from_slice_mut( uint8_t * data, uint64_t data_len ) {
    uint64_t required_size;
    if( Instruction_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (Instruction_t *)data;
}

int Instruction_new( uint8_t * buffer, uint64_t buffer_size, uint16_t data_len, uint64_t * out_size ) {
    uint64_t required_size = 0;
    required_size += 1; /* tag */
    required_size += 2; /* data_len */
    required_size += (data_len) * 1; /* data (variable array) */

    if( buffer_size < required_size ) {
        return -1; /* Buffer too small */
    }

    memset( buffer, 0, required_size );

    uint64_t offset = 0;

    offset += 1;

    memcpy( &buffer[offset], &data_len, sizeof( data_len ) );
    offset += 2;

    offset += (data_len) * 1; /* skip variable array 'data' (set via setters) */

    *out_size = required_size;
    return 0; /* Success */
}

uint8_t Instruction_get_tag( Instruction_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    return data[0];
}

uint16_t Instruction_get_data_len( Instruction_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 1; /* tag */
    return ({ uint16_t val; memcpy( &val, &data[offset], sizeof( val ) ); val; });
}

/* Variable-size array accessor helpers for data */
uint64_t Instruction_get_data_length( Instruction_t const * self ) {
    return (Instruction_get_data_len( self ));
}

uint8_t Instruction_get_data_at( Instruction_t const * self, uint64_t index ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t base_offset = 0;
    base_offset += 1; /* tag */
    base_offset += 2; /* data_len */
    uint64_t offset = base_offset + index * 1; /* element index */
    return data[offset];
}

uint8_t const * Instruction_get_data_const( Instruction_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 1; /* tag */
    offset += 2; /* data_len */
    return &data[offset];
}

void Instruction_set_tag( Instruction_t * self, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    data[0] = value;
}

void Instruction_set_data_len( Instruction_t * self, uint16_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 1; /* tag */
    memcpy( &data[offset], &value, sizeof( value ) );
}

void Instruction_set_data_at( Instruction_t * self, uint64_t index, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t base_offset = 0;
    base_offset += 1; /* tag */
    base_offset += 2; /* data_len */
    uint64_t offset = base_offset + index * 1;
    data[offset] = value;
}

void Instruction_set_data( uint8_t * data, uint8_t const * slice, uint64_t slice_len ) {
    uint64_t offset = 0;
    offset += 1; /* tag */
    offset += 2; /* data_len */
    uint64_t len = Instruction_get_data_length( (Instruction_t const *)data );
    if( slice_len < len ) len = slice_len;
    memcpy( &data[offset], slice, len );
}

uint8_t * Instruction_get_data( uint8_t * data ) {
    uint64_t offset = 0;
    offset += 1; /* tag */
    offset += 2; /* data_len */
    return &data[offset];
}

int Instruction_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size ) {
    uint64_t offset = 0;

    if( offset + 1 > data_len ) {
        return -1; /* Buffer too small for 'tag' */
    }
    offset += 1; /* tag */

    if( offset + 2 > data_len ) {
        return -1; /* Buffer too small for 'data_len' */
    }
    uint64_t offset_data_len = offset;
    offset += 2; /* data_len */

    *out_size = offset;
    return 0;
}

/*  ----- FUNCTIONS FOR KvGetPayload ----- */

uint64_t KvGetPayload_footprint( int64_t key_len ) {
  return KvGetPayload_footprint_ir( (uint64_t)key_len );
}

/* IR footprint generated for KvGetPayload */
uint64_t KvGetPayload_footprint_ir( uint64_t key_key_len ) {
    return (((((((1ULL) + 1ULL - 1ULL) & ~(1ULL - 1ULL)) + ((((key_key_len * 1ULL)) + 1ULL - 1ULL) & ~(1ULL - 1ULL)))) + 1ULL - 1ULL) & ~(1ULL - 1ULL));
}
/* IR validator generated for KvGetPayload */
int KvGetPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t key_key_len ) {
  uint64_t tn_val_0 = 1ULL;
  uint64_t tn_val_1 = 1ULL;
  uint64_t tn_val_2 = 0ULL;
  if( tn_checked_mul_u64( key_key_len, tn_val_1, &tn_val_2 ) ) return 3;
  uint64_t tn_val_3 = 0ULL;
  if( tn_checked_add_u64( tn_val_0, tn_val_2, &tn_val_3 ) ) return 3;
  if( tn_val_3 > buf_sz ) return 1;
  if( out_bytes_consumed ) *out_bytes_consumed = tn_val_3;
  return 0;
}

KvGetPayload_t const * KvGetPayload_from_slice( uint8_t const * data, uint64_t data_len ) {
    uint64_t required_size;
    if( KvGetPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (KvGetPayload_t const *)data;
}

KvGetPayload_t * KvGetPayload_from_slice_mut( uint8_t * data, uint64_t data_len ) {
    uint64_t required_size;
    if( KvGetPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (KvGetPayload_t *)data;
}

int KvGetPayload_new( uint8_t * buffer, uint64_t buffer_size, uint8_t key_len, uint64_t * out_size ) {
    uint64_t required_size = 0;
    required_size += 1; /* key_len */
    required_size += (key_len) * 1; /* key (variable array) */

    if( buffer_size < required_size ) {
        return -1; /* Buffer too small */
    }

    memset( buffer, 0, required_size );

    uint64_t offset = 0;

    buffer[offset] = key_len;
    offset += 1;

    offset += (key_len) * 1; /* skip variable array 'key' (set via setters) */

    *out_size = required_size;
    return 0; /* Success */
}

uint8_t KvGetPayload_get_key_len( KvGetPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    return data[0];
}

/* Variable-size array accessor helpers for key */
uint64_t KvGetPayload_get_key_length( KvGetPayload_t const * self ) {
    return (KvGetPayload_get_key_len( self ));
}

uint8_t KvGetPayload_get_key_at( KvGetPayload_t const * self, uint64_t index ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t base_offset = 0;
    base_offset += 1; /* key_len */
    uint64_t offset = base_offset + index * 1; /* element index */
    return data[offset];
}

uint8_t const * KvGetPayload_get_key_const( KvGetPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 1; /* key_len */
    return &data[offset];
}

void KvGetPayload_set_key_len( KvGetPayload_t * self, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    data[0] = value;
}

void KvGetPayload_set_key_at( KvGetPayload_t * self, uint64_t index, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t base_offset = 0;
    base_offset += 1; /* key_len */
    uint64_t offset = base_offset + index * 1;
    data[offset] = value;
}

void KvGetPayload_set_key( uint8_t * data, uint8_t const * slice, uint64_t slice_len ) {
    uint64_t offset = 0;
    offset += 1; /* key_len */
    uint64_t len = KvGetPayload_get_key_length( (KvGetPayload_t const *)data );
    if( slice_len < len ) len = slice_len;
    memcpy( &data[offset], slice, len );
}

uint8_t * KvGetPayload_get_key( uint8_t * data ) {
    uint64_t offset = 0;
    offset += 1; /* key_len */
    return &data[offset];
}

int KvGetPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size ) {
    uint64_t offset = 0;

    if( offset + 1 > data_len ) {
        return -1; /* Buffer too small for 'key_len' */
    }
    offset += 1; /* key_len */

    *out_size = offset;
    return 0;
}

/*  ----- FUNCTIONS FOR KvSetPayload ----- */

uint64_t KvSetPayload_footprint( int64_t key_len, int64_t val_len ) {
  return KvSetPayload_footprint_ir( (uint64_t)key_len, (uint64_t)val_len );
}

/* IR footprint generated for KvSetPayload */
uint64_t KvSetPayload_footprint_ir( uint64_t key_key_len, uint64_t val_val_len ) {
    return (((((((((1ULL) + 1ULL - 1ULL) & ~(1ULL - 1ULL)) + ((((key_key_len * 1ULL)) + 1ULL - 1ULL) & ~(1ULL - 1ULL))) + (((2ULL) + 2ULL - 1ULL) & ~(2ULL - 1ULL))) + ((((val_val_len * 1ULL)) + 1ULL - 1ULL) & ~(1ULL - 1ULL)))) + 1ULL - 1ULL) & ~(1ULL - 1ULL));
}
/* IR validator generated for KvSetPayload */
int KvSetPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t key_key_len, uint64_t val_val_len ) {
  uint64_t tn_val_0 = 1ULL;
  uint64_t tn_val_1 = 1ULL;
  uint64_t tn_val_2 = 0ULL;
  if( tn_checked_mul_u64( key_key_len, tn_val_1, &tn_val_2 ) ) return 3;
  uint64_t tn_val_3 = 0ULL;
  if( tn_checked_add_u64( tn_val_0, tn_val_2, &tn_val_3 ) ) return 3;
  uint64_t tn_val_4 = 2ULL;
  uint64_t tn_val_5 = tn_val_4;
  uint64_t tn_val_6 = tn_val_5 % 2ULL;
  if( tn_val_6 ) {
    uint64_t tn_val_7 = 2ULL - tn_val_6;
    if( tn_checked_add_u64( tn_val_5, tn_val_7, &tn_val_5 ) ) return 3;
  }
  uint64_t tn_val_8 = 0ULL;
  if( tn_checked_add_u64( tn_val_3, tn_val_5, &tn_val_8 ) ) return 3;
  uint64_t tn_val_9 = 1ULL;
  uint64_t tn_val_10 = 0ULL;
  if( tn_checked_mul_u64( val_val_len, tn_val_9, &tn_val_10 ) ) return 3;
  uint64_t tn_val_11 = 0ULL;
  if( tn_checked_add_u64( tn_val_8, tn_val_10, &tn_val_11 ) ) return 3;
  if( tn_val_11 > buf_sz ) return 1;
  if( out_bytes_consumed ) *out_bytes_consumed = tn_val_11;
  return 0;
}

KvSetPayload_t const * KvSetPayload_from_slice( uint8_t const * data, uint64_t data_len ) {
    uint64_t required_size;
    if( KvSetPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (KvSetPayload_t const *)data;
}

KvSetPayload_t * KvSetPayload_from_slice_mut( uint8_t * data, uint64_t data_len ) {
    uint64_t required_size;
    if( KvSetPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (KvSetPayload_t *)data;
}

int KvSetPayload_new( uint8_t * buffer, uint64_t buffer_size, uint8_t key_len, uint16_t val_len, uint64_t * out_size ) {
    uint64_t required_size = 0;
    required_size += 1; /* key_len */
    required_size += (key_len) * 1; /* key (variable array) */
    required_size += 2; /* val_len */
    required_size += (val_len) * 1; /* val (variable array) */

    if( buffer_size < required_size ) {
        return -1; /* Buffer too small */
    }

    memset( buffer, 0, required_size );

    uint64_t offset = 0;

    buffer[offset] = key_len;
    offset += 1;

    offset += (key_len) * 1; /* skip variable array 'key' (set via setters) */

    memcpy( &buffer[offset], &val_len, sizeof( val_len ) );
    offset += 2;

    offset += (val_len) * 1; /* skip variable array 'val' (set via setters) */

    *out_size = required_size;
    return 0; /* Success */
}

uint8_t KvSetPayload_get_key_len( KvSetPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    return data[0];
}

/* Variable-size array accessor helpers for key */
uint64_t KvSetPayload_get_key_length( KvSetPayload_t const * self ) {
    return (KvSetPayload_get_key_len( self ));
}

uint8_t KvSetPayload_get_key_at( KvSetPayload_t const * self, uint64_t index ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t base_offset = 0;
    base_offset += 1; /* key_len */
    uint64_t offset = base_offset + index * 1; /* element index */
    return data[offset];
}

uint8_t const * KvSetPayload_get_key_const( KvSetPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 1; /* key_len */
    return &data[offset];
}

uint16_t KvSetPayload_get_val_len( KvSetPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 1; /* key_len */
    offset += (KvSetPayload_get_key_len( self )) * 1; /* key (variable array) */
    return ({ uint16_t val; memcpy( &val, &data[offset], sizeof( val ) ); val; });
}

/* Variable-size array accessor helpers for val */
uint64_t KvSetPayload_get_val_length( KvSetPayload_t const * self ) {
    return (KvSetPayload_get_val_len( self ));
}

uint8_t KvSetPayload_get_val_at( KvSetPayload_t const * self, uint64_t index ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t base_offset = 0;
    base_offset += 1; /* key_len */
    base_offset += KvSetPayload_get_key_length( self ) * 1; /* key (variable array) */
    base_offset += 2; /* val_len */
    uint64_t offset = base_offset + index * 1; /* element index */
    return data[offset];
}

uint8_t const * KvSetPayload_get_val_const( KvSetPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 1; /* key_len */
    offset += KvSetPayload_get_key_length( self ) * 1; /* key (variable array) */
    offset += 2; /* val_len */
    return &data[offset];
}

void KvSetPayload_set_key_len( KvSetPayload_t * self, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    data[0] = value;
}

void KvSetPayload_set_key_at( KvSetPayload_t * self, uint64_t index, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t base_offset = 0;
    base_offset += 1; /* key_len */
    uint64_t offset = base_offset + index * 1;
    data[offset] = value;
}

void KvSetPayload_set_key( uint8_t * data, uint8_t const * slice, uint64_t slice_len ) {
    uint64_t offset = 0;
    offset += 1; /* key_len */
    uint64_t len = KvSetPayload_get_key_length( (KvSetPayload_t const *)data );
    if( slice_len < len ) len = slice_len;
    memcpy( &data[offset], slice, len );
}

uint8_t * KvSetPayload_get_key( uint8_t * data ) {
    uint64_t offset = 0;
    offset += 1; /* key_len */
    return &data[offset];
}

void KvSetPayload_set_val_len( KvSetPayload_t * self, uint16_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 1; /* key_len */
    offset += KvSetPayload_get_key_length( (KvSetPayload_t const *)data ) * 1; /* key (variable array) */
    memcpy( &data[offset], &value, sizeof( value ) );
}

void KvSetPayload_set_val_at( KvSetPayload_t * self, uint64_t index, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t base_offset = 0;
    base_offset += 1; /* key_len */
    base_offset += KvSetPayload_get_key_length( (KvSetPayload_t const *)data ) * 1; /* key (variable array) */
    base_offset += 2; /* val_len */
    uint64_t offset = base_offset + index * 1;
    data[offset] = value;
}

void KvSetPayload_set_val( uint8_t * data, uint8_t const * slice, uint64_t slice_len ) {
    uint64_t offset = 0;
    offset += 1; /* key_len */
    offset += KvSetPayload_get_key_length( (KvSetPayload_t const *)data ) * 1; /* key (variable array) */
    offset += 2; /* val_len */
    uint64_t len = KvSetPayload_get_val_length( (KvSetPayload_t const *)data );
    if( slice_len < len ) len = slice_len;
    memcpy( &data[offset], slice, len );
}

uint8_t * KvSetPayload_get_val( uint8_t * data ) {
    uint64_t offset = 0;
    offset += 1; /* key_len */
    offset += KvSetPayload_get_key_length( (KvSetPayload_t const *)data ) * 1; /* key (variable array) */
    offset += 2; /* val_len */
    return &data[offset];
}

int KvSetPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size ) {
    uint64_t offset = 0;

    if( offset + 1 > data_len ) {
        return -1; /* Buffer too small for 'key_len' */
    }
    offset += 1; /* key_len */

    if( offset + 2 > data_len ) {
        return -1; /* Buffer too small for 'val_len' */
    }
    uint64_t offset_val_len = offset;
    offset += 2; /* val_len */

    *out_size = offset;
    return 0;
}

/*  ----- FUNCTIONS FOR MerklePayload ----- */

uint64_t MerklePayload_footprint( int64_t data_len ) {
  return MerklePayload_footprint_ir( (uint64_t)data_len );
}

/* IR footprint generated for MerklePayload */
uint64_t MerklePayload_footprint_ir( uint64_t data_data_len ) {
    return ((((((((2ULL) + 2ULL - 1ULL) & ~(2ULL - 1ULL)) + (((2ULL) + 2ULL - 1ULL) & ~(2ULL - 1ULL))) + ((((data_data_len * 1ULL)) + 1ULL - 1ULL) & ~(1ULL - 1ULL)))) + 1ULL - 1ULL) & ~(1ULL - 1ULL));
}
/* IR validator generated for MerklePayload */
int MerklePayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t data_data_len ) {
  uint64_t tn_val_0 = 2ULL;
  uint64_t tn_val_1 = tn_val_0;
  uint64_t tn_val_2 = tn_val_1 % 2ULL;
  if( tn_val_2 ) {
    uint64_t tn_val_3 = 2ULL - tn_val_2;
    if( tn_checked_add_u64( tn_val_1, tn_val_3, &tn_val_1 ) ) return 3;
  }
  uint64_t tn_val_4 = 2ULL;
  uint64_t tn_val_5 = tn_val_4;
  uint64_t tn_val_6 = tn_val_5 % 2ULL;
  if( tn_val_6 ) {
    uint64_t tn_val_7 = 2ULL - tn_val_6;
    if( tn_checked_add_u64( tn_val_5, tn_val_7, &tn_val_5 ) ) return 3;
  }
  uint64_t tn_val_8 = 0ULL;
  if( tn_checked_add_u64( tn_val_1, tn_val_5, &tn_val_8 ) ) return 3;
  uint64_t tn_val_9 = 1ULL;
  uint64_t tn_val_10 = 0ULL;
  if( tn_checked_mul_u64( data_data_len, tn_val_9, &tn_val_10 ) ) return 3;
  uint64_t tn_val_11 = 0ULL;
  if( tn_checked_add_u64( tn_val_8, tn_val_10, &tn_val_11 ) ) return 3;
  if( tn_val_11 > buf_sz ) return 1;
  if( out_bytes_consumed ) *out_bytes_consumed = tn_val_11;
  return 0;
}

MerklePayload_t const * MerklePayload_from_slice( uint8_t const * data, uint64_t data_len ) {
    uint64_t required_size;
    if( MerklePayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (MerklePayload_t const *)data;
}

MerklePayload_t * MerklePayload_from_slice_mut( uint8_t * data, uint64_t data_len ) {
    uint64_t required_size;
    if( MerklePayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (MerklePayload_t *)data;
}

int MerklePayload_new( uint8_t * buffer, uint64_t buffer_size, uint16_t data_len, uint64_t * out_size ) {
    uint64_t required_size = 0;
    required_size += 2; /* chunk_size */
    required_size += 2; /* data_len */
    required_size += (data_len) * 1; /* data (variable array) */

    if( buffer_size < required_size ) {
        return -1; /* Buffer too small */
    }

    memset( buffer, 0, required_size );

    uint64_t offset = 0;

    offset += 2;

    memcpy( &buffer[offset], &data_len, sizeof( data_len ) );
    offset += 2;

    offset += (data_len) * 1; /* skip variable array 'data' (set via setters) */

    *out_size = required_size;
    return 0; /* Success */
}

uint16_t MerklePayload_get_chunk_size( MerklePayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    return ({ uint16_t val; memcpy( &val, &data[0], sizeof( val ) ); val; });
}

uint16_t MerklePayload_get_data_len( MerklePayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 2; /* chunk_size */
    return ({ uint16_t val; memcpy( &val, &data[offset], sizeof( val ) ); val; });
}

/* Variable-size array accessor helpers for data */
uint64_t MerklePayload_get_data_length( MerklePayload_t const * self ) {
    return (MerklePayload_get_data_len( self ));
}

uint8_t MerklePayload_get_data_at( MerklePayload_t const * self, uint64_t index ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t base_offset = 0;
    base_offset += 2; /* chunk_size */
    base_offset += 2; /* data_len */
    uint64_t offset = base_offset + index * 1; /* element index */
    return data[offset];
}

uint8_t const * MerklePayload_get_data_const( MerklePayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 2; /* chunk_size */
    offset += 2; /* data_len */
    return &data[offset];
}

void MerklePayload_set_chunk_size( MerklePayload_t * self, uint16_t value ) {
    uint8_t * data = (uint8_t *)self;
    memcpy( &data[0], &value, sizeof( value ) );
}

void MerklePayload_set_data_len( MerklePayload_t * self, uint16_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 2; /* chunk_size */
    memcpy( &data[offset], &value, sizeof( value ) );
}

void MerklePayload_set_data_at( MerklePayload_t * self, uint64_t index, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t base_offset = 0;
    base_offset += 2; /* chunk_size */
    base_offset += 2; /* data_len */
    uint64_t offset = base_offset + index * 1;
    data[offset] = value;
}

void MerklePayload_set_data( uint8_t * data, uint8_t const * slice, uint64_t slice_len ) {
    uint64_t offset = 0;
    offset += 2; /* chunk_size */
    offset += 2; /* data_len */
    uint64_t len = MerklePayload_get_data_length( (MerklePayload_t const *)data );
    if( slice_len < len ) len = slice_len;
    memcpy( &data[offset], slice, len );
}

uint8_t * MerklePayload_get_data( uint8_t * data ) {
    uint64_t offset = 0;
    offset += 2; /* chunk_size */
    offset += 2; /* data_len */
    return &data[offset];
}

int MerklePayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size ) {
    uint64_t offset = 0;

    if( offset + 2 > data_len ) {
        return -1; /* Buffer too small for 'chunk_size' */
    }
    offset += 2; /* chunk_size */

    if( offset + 2 > data_len ) {
        return -1; /* Buffer too small for 'data_len' */
    }
    uint64_t offset_data_len = offset;
    offset += 2; /* data_len */

    *out_size = offset;
    return 0;
}

/*  ----- FUNCTIONS FOR PsiError ----- */

uint64_t PsiError_footprint( void ) {
  return PsiError_footprint_ir();
}

/* IR footprint generated for PsiError */
uint64_t PsiError_footprint_ir( void ) {
    return 1ULL;
}
/* IR validator generated for PsiError */
int PsiError_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed ) {
  uint64_t tn_val_0 = 1ULL;
  if( tn_val_0 > buf_sz ) return 1;
  if( out_bytes_consumed ) *out_bytes_consumed = tn_val_0;
  return 0;
}

/*  ----- FUNCTIONS FOR PsiState ----- */

uint64_t PsiState_footprint( void ) {
  return PsiState_footprint_ir();
}

/* IR footprint generated for PsiState */
uint64_t PsiState_footprint_ir( void ) {
    return 20ULL;
}
/* IR validator generated for PsiState */
int PsiState_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed ) {
  uint64_t tn_val_0 = 20ULL;
  if( tn_val_0 > buf_sz ) return 1;
  if( out_bytes_consumed ) *out_bytes_consumed = tn_val_0;
  return 0;
}

PsiState_t const * PsiState_from_slice( uint8_t const * data, uint64_t data_len ) {
    uint64_t required_size;
    if( PsiState_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (PsiState_t const *)data;
}

PsiState_t * PsiState_from_slice_mut( uint8_t * data, uint64_t data_len ) {
    uint64_t required_size;
    if( PsiState_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (PsiState_t *)data;
}

int PsiState_new( uint8_t * buffer, uint64_t buffer_size, uint64_t * out_size ) {
    uint64_t required_size = 0;
    required_size += 8; /* magic */
    required_size += 8; /* counter */
    required_size += 2; /* kv_count */
    required_size += 2; /* data_offset */

    if( buffer_size < required_size ) {
        return -1; /* Buffer too small */
    }

    memset( buffer, 0, required_size );

    uint64_t offset = 0;

    offset += 8;

    offset += 8;

    offset += 2;

    offset += 2;

    *out_size = required_size;
    return 0; /* Success */
}

uint64_t PsiState_get_magic( PsiState_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    return ({ uint64_t val; memcpy( &val, &data[0], sizeof( val ) ); val; });
}

uint64_t PsiState_get_counter( PsiState_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 8; /* magic */
    return ({ uint64_t val; memcpy( &val, &data[offset], sizeof( val ) ); val; });
}

uint16_t PsiState_get_kv_count( PsiState_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 8; /* magic */
    offset += 8; /* counter */
    return ({ uint16_t val; memcpy( &val, &data[offset], sizeof( val ) ); val; });
}

uint16_t PsiState_get_data_offset( PsiState_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 8; /* magic */
    offset += 8; /* counter */
    offset += 2; /* kv_count */
    return ({ uint16_t val; memcpy( &val, &data[offset], sizeof( val ) ); val; });
}

void PsiState_set_magic( PsiState_t * self, uint64_t value ) {
    uint8_t * data = (uint8_t *)self;
    memcpy( &data[0], &value, sizeof( value ) );
}

void PsiState_set_counter( PsiState_t * self, uint64_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 8; /* magic */
    memcpy( &data[offset], &value, sizeof( value ) );
}

void PsiState_set_kv_count( PsiState_t * self, uint16_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 8; /* magic */
    offset += 8; /* counter */
    memcpy( &data[offset], &value, sizeof( value ) );
}

void PsiState_set_data_offset( PsiState_t * self, uint16_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 8; /* magic */
    offset += 8; /* counter */
    offset += 2; /* kv_count */
    memcpy( &data[offset], &value, sizeof( value ) );
}

int PsiState_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size ) {
    uint64_t offset = 0;

    if( offset + 8 > data_len ) {
        return -1; /* Buffer too small for 'magic' */
    }
    offset += 8; /* magic */

    if( offset + 8 > data_len ) {
        return -1; /* Buffer too small for 'counter' */
    }
    offset += 8; /* counter */

    if( offset + 2 > data_len ) {
        return -1; /* Buffer too small for 'kv_count' */
    }
    offset += 2; /* kv_count */

    if( offset + 2 > data_len ) {
        return -1; /* Buffer too small for 'data_offset' */
    }
    offset += 2; /* data_offset */

    *out_size = offset;
    return 0;
}

/*  ----- FUNCTIONS FOR ReadDataPayload ----- */

uint64_t ReadDataPayload_footprint( void ) {
  return ReadDataPayload_footprint_ir();
}

/* IR footprint generated for ReadDataPayload */
uint64_t ReadDataPayload_footprint_ir( void ) {
    return 4ULL;
}
/* IR validator generated for ReadDataPayload */
int ReadDataPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed ) {
  uint64_t tn_val_0 = 4ULL;
  if( tn_val_0 > buf_sz ) return 1;
  if( out_bytes_consumed ) *out_bytes_consumed = tn_val_0;
  return 0;
}

ReadDataPayload_t const * ReadDataPayload_from_slice( uint8_t const * data, uint64_t data_len ) {
    uint64_t required_size;
    if( ReadDataPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (ReadDataPayload_t const *)data;
}

ReadDataPayload_t * ReadDataPayload_from_slice_mut( uint8_t * data, uint64_t data_len ) {
    uint64_t required_size;
    if( ReadDataPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (ReadDataPayload_t *)data;
}

int ReadDataPayload_new( uint8_t * buffer, uint64_t buffer_size, uint64_t * out_size ) {
    uint64_t required_size = 0;
    required_size += 2; /* offset */
    required_size += 2; /* length */

    if( buffer_size < required_size ) {
        return -1; /* Buffer too small */
    }

    memset( buffer, 0, required_size );

    uint64_t offset = 0;

    offset += 2;

    offset += 2;

    *out_size = required_size;
    return 0; /* Success */
}

uint16_t ReadDataPayload_get_offset( ReadDataPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    return ({ uint16_t val; memcpy( &val, &data[0], sizeof( val ) ); val; });
}

uint16_t ReadDataPayload_get_length( ReadDataPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 2; /* offset */
    return ({ uint16_t val; memcpy( &val, &data[offset], sizeof( val ) ); val; });
}

void ReadDataPayload_set_offset( ReadDataPayload_t * self, uint16_t value ) {
    uint8_t * data = (uint8_t *)self;
    memcpy( &data[0], &value, sizeof( value ) );
}

void ReadDataPayload_set_length( ReadDataPayload_t * self, uint16_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 2; /* offset */
    memcpy( &data[offset], &value, sizeof( value ) );
}

int ReadDataPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size ) {
    uint64_t offset = 0;

    if( offset + 2 > data_len ) {
        return -1; /* Buffer too small for 'offset' */
    }
    offset += 2; /* offset */

    if( offset + 2 > data_len ) {
        return -1; /* Buffer too small for 'length' */
    }
    offset += 2; /* length */

    *out_size = offset;
    return 0;
}

/*  ----- FUNCTIONS FOR TransferPayload ----- */

uint64_t TransferPayload_footprint( void ) {
  return TransferPayload_footprint_ir();
}

/* IR footprint generated for TransferPayload */
uint64_t TransferPayload_footprint_ir( void ) {
    return 8ULL;
}
/* IR validator generated for TransferPayload */
int TransferPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed ) {
  uint64_t tn_val_0 = 8ULL;
  if( tn_val_0 > buf_sz ) return 1;
  if( out_bytes_consumed ) *out_bytes_consumed = tn_val_0;
  return 0;
}

TransferPayload_t const * TransferPayload_from_slice( uint8_t const * data, uint64_t data_len ) {
    uint64_t required_size;
    if( TransferPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (TransferPayload_t const *)data;
}

TransferPayload_t * TransferPayload_from_slice_mut( uint8_t * data, uint64_t data_len ) {
    uint64_t required_size;
    if( TransferPayload_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (TransferPayload_t *)data;
}

int TransferPayload_new( uint8_t * buffer, uint64_t buffer_size, uint64_t * out_size ) {
    uint64_t required_size = 0;
    required_size += 8; /* amount */

    if( buffer_size < required_size ) {
        return -1; /* Buffer too small */
    }

    memset( buffer, 0, required_size );

    uint64_t offset = 0;

    offset += 8;

    *out_size = required_size;
    return 0; /* Success */
}

uint64_t TransferPayload_get_amount( TransferPayload_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    return ({ uint64_t val; memcpy( &val, &data[0], sizeof( val ) ); val; });
}

void TransferPayload_set_amount( TransferPayload_t * self, uint64_t value ) {
    uint8_t * data = (uint8_t *)self;
    memcpy( &data[0], &value, sizeof( value ) );
}

int TransferPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size ) {
    uint64_t offset = 0;

    if( offset + 8 > data_len ) {
        return -1; /* Buffer too small for 'amount' */
    }
    offset += 8; /* amount */

    *out_size = offset;
    return 0;
}

/*  ----- FUNCTIONS FOR VersionInfo ----- */

uint64_t VersionInfo_footprint( void ) {
  return VersionInfo_footprint_ir();
}

/* IR footprint generated for VersionInfo */
uint64_t VersionInfo_footprint_ir( void ) {
    return 3ULL;
}
/* IR validator generated for VersionInfo */
int VersionInfo_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed ) {
  uint64_t tn_val_0 = 3ULL;
  if( tn_val_0 > buf_sz ) return 1;
  if( out_bytes_consumed ) *out_bytes_consumed = tn_val_0;
  return 0;
}

VersionInfo_t const * VersionInfo_from_slice( uint8_t const * data, uint64_t data_len ) {
    uint64_t required_size;
    if( VersionInfo_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (VersionInfo_t const *)data;
}

VersionInfo_t * VersionInfo_from_slice_mut( uint8_t * data, uint64_t data_len ) {
    uint64_t required_size;
    if( VersionInfo_validate( data, data_len, &required_size ) != 0 ) {
        return NULL;
    }
    return (VersionInfo_t *)data;
}

int VersionInfo_new( uint8_t * buffer, uint64_t buffer_size, uint64_t * out_size ) {
    uint64_t required_size = 0;
    required_size += 1; /* major */
    required_size += 1; /* minor */
    required_size += 1; /* patch */

    if( buffer_size < required_size ) {
        return -1; /* Buffer too small */
    }

    memset( buffer, 0, required_size );

    uint64_t offset = 0;

    offset += 1;

    offset += 1;

    offset += 1;

    *out_size = required_size;
    return 0; /* Success */
}

uint8_t VersionInfo_get_major( VersionInfo_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    return data[0];
}

uint8_t VersionInfo_get_minor( VersionInfo_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 1; /* major */
    return data[offset];
}

uint8_t VersionInfo_get_patch( VersionInfo_t const * self ) {
    uint8_t const * data = (uint8_t const *)self;
    uint64_t offset = 0;
    offset += 1; /* major */
    offset += 1; /* minor */
    return data[offset];
}

void VersionInfo_set_major( VersionInfo_t * self, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    data[0] = value;
}

void VersionInfo_set_minor( VersionInfo_t * self, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 1; /* major */
    data[offset] = value;
}

void VersionInfo_set_patch( VersionInfo_t * self, uint8_t value ) {
    uint8_t * data = (uint8_t *)self;
    uint64_t offset = 0;
    offset += 1; /* major */
    offset += 1; /* minor */
    data[offset] = value;
}

int VersionInfo_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size ) {
    uint64_t offset = 0;

    if( offset + 1 > data_len ) {
        return -1; /* Buffer too small for 'major' */
    }
    offset += 1; /* major */

    if( offset + 1 > data_len ) {
        return -1; /* Buffer too small for 'minor' */
    }
    offset += 1; /* minor */

    if( offset + 1 > data_len ) {
        return -1; /* Buffer too small for 'patch' */
    }
    offset += 1; /* patch */

    *out_size = offset;
    return 0;
}

